import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { fetchAllProducts, fetchAllCategories, fetchProductsByCategoryIds, getStockLabel } from "@/lib/shop";
import type { Product, Category } from "@/lib/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- OpenAI Tool Definitions ---

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "search_products",
      description:
        "Fulltext vyhledávání v názvech produktů. Hledej konkrétní slova z názvů produktů (např. 'krkovice', 'guláš', 'klobása'). Pro obecné kategorie jako 'hotovky', 'uzeniny', 'maso' použij raději get_categories + get_products_by_category.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Hledaný výraz, např. 'krkovice', 'klobása', 'uzené'",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_categories",
      description:
        "Vrátí seznam všech kategorií produktů (hovězí, vepřové, uzeniny atd.). Použij když zákazník chce vědět co nabízíme nebo se ptá na kategorie.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_products_by_category",
      description:
        "Vrátí produkty z konkrétní kategorie podle ID. Použij po get_categories když zákazník chce vidět konkrétní kategorii.",
      parameters: {
        type: "object",
        properties: {
          category_id: {
            type: "string",
            description: "UUID kategorie",
          },
        },
        required: ["category_id"],
      },
    },
  },
];

// --- Format product for LLM (keep token count low) ---

function formatProductForLLM(product: Product) {
  return {
    name: product.name,
    slug: product.slug,
    price: product.price,
    unit: product.unit,
    stock_status: getStockLabel(product.stock_status),
    badge: product.badge,
    weight_info: product.weight_info,
    url: `/produkt/${product.slug}`,
  };
}

// --- Tool Executor ---

async function executeTool(name: string, args: Record<string, unknown>) {
  try {
    switch (name) {
      case "search_products": {
        const query = (args.query as string) || "";
        const products = await fetchAllProducts({ query });
        return products.slice(0, 10).map(formatProductForLLM);
      }
      case "get_categories": {
        const categories = (await fetchAllCategories()) as Category[];
        return categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
        }));
      }
      case "get_products_by_category": {
        const categoryId = args.category_id as string;
        if (!categoryId) return { error: "Chybí category_id" };
        const products = await fetchProductsByCategoryIds([categoryId]);
        return products.slice(0, 10).map(formatProductForLLM);
      }
      default:
        return { error: `Neznámý nástroj: ${name}` };
    }
  } catch (err) {
    console.error(`Tool ${name} error:`, err);
    return { error: "Nepodařilo se načíst data z databáze." };
  }
}

// --- System Prompt ---

const SYSTEM_PROMPT = `Jsi asistent e-shopu MASI-CO — online řeznictví s vlastním rozvozem po Praze a okolí.

Styl komunikace:
- VŽDY vykej ("Vy", "Váš", "máte", "chcete"). Tykej JEN pokud zákazník sám nabídne tykání ("tykej mi", "můžeme si tykat" apod.)
- Piš přirozeně, jako zkušený řezník za pultem — věcně, stručně, bez zbytečných frází
- Žádné "skvělé!", "výborná volba!", "mám pro vás skvělé možnosti" — prostě rovnou k věci
- Max 2-3 věty + seznam produktů. Méně je více.

Postup doporučování:
1. Zeptej se 1-2 věcné otázky k upřesnění:
   - K jaké příležitosti? (vaření, grilování, studený bufet/obložené mísy, svačina)
   - Pro kolik osob?
   - Preference druhu masa? (hovězí, vepřové, kuřecí, mix)
2. Použij nástroje k vyhledání produktů — NIKDY netvrd že něco máme nebo nemáme bez ověření v databázi
3. Doporuč 2-4 konkrétní produkty s cenami a odkazy

Co nabízíme (pro tvoji orientaci, ale vždy ověř nástrojem):
- Čerstvé maso: hovězí, vepřové, kuřecí, telecí, zvěřina, ryby
- Uzeniny: klobásy, salámy, šunky, párky, špekáčky, uzené maso
- Hotová jídla ve sklenicích 900ml: guláš, svíčková, koprová omáčka atd.
- Mleté maso, droby, kosti, ostatní sortiment

Formát doporučení:
- Každý produkt: [Název produktu](/produkt/slug) — CENA Kč/jednotka
- Přidej stručný praktický tip (kolik kg na osobu, jak připravit)
- Pokud je produkt "Vyprodáno", uveď to

Pravidla:
- NIKDY nevymýšlej produkty — používej POUZE data z nástrojů
- NEJDŘÍV hledej, PAK odpovídej. Nikdy neříkej "nemáme X" bez ověření.
- Minimální objednávka 1 000 Kč, doprava zdarma od 1 500 Kč
- Rozvoz po Praze a okolí, Po–Pá`;

// --- POST Handler with Tool Call Loop ---

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Missing messages" }, { status: 400 });
    }

    const trimmed = messages.slice(-20);

    const chatMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...trimmed,
    ];

    // Tool call loop — max 3 rounds
    for (let round = 0; round < 3; round++) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: chatMessages,
        tools,
        max_tokens: 400,
        temperature: 0.7,
      });

      const choice = completion.choices[0];

      if (!choice) {
        return NextResponse.json({ reply: "Omlouvám se, zkuste to znovu." });
      }

      // Text response — done
      if (choice.finish_reason !== "tool_calls" || !choice.message.tool_calls?.length) {
        const reply = choice.message.content || "Omlouvám se, zkuste to znovu.";
        return NextResponse.json({ reply });
      }

      // Process tool calls
      chatMessages.push(choice.message);

      for (const toolCall of choice.message.tool_calls) {
        if (toolCall.type !== "function") continue;
        const args = JSON.parse(toolCall.function.arguments || "{}");
        const result = await executeTool(toolCall.function.name, args);

        chatMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }
    }

    // Exhausted rounds — one final call without tools
    const finalCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatMessages,
      max_tokens: 400,
      temperature: 0.7,
    });

    const reply =
      finalCompletion.choices[0]?.message?.content || "Omlouvám se, zkuste to znovu.";
    return NextResponse.json({ reply });
  } catch (err: unknown) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Chyba při komunikaci s asistentem." },
      { status: 500 },
    );
  }
}
