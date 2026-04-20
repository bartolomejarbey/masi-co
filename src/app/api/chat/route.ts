import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `Jsi přátelský asistent e-shopu MASI-CO — online řeznictví s rozvozem po Praze a okolí.

Tvoje úloha:
- Pomáhat zákazníkům s výběrem masa, uzenin, hotových jídel
- Odpovídat na dotazy o produktech, cenách, doručení
- Doporučovat podle preferencí (grilování, guláš, svíčková atd.)
- Informovat o podmínkách: minimální objednávka 1 000 Kč, doprava zdarma od 1 500 Kč, rozvoz po Praze a okolí
- Provozní doba rozvozu: Po–Pá

Styl:
- Piš česky, stručně, přátelsky
- Používej krátké odpovědi (max 2-3 věty)
- Pokud si nejsi jistý cenou, řekni ať se podívají do katalogu
- Nikdy nevymýšlej produkty které neexistují`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Missing messages" }, { status: 400 });
    }

    // Limit conversation history to last 20 messages
    const trimmed = messages.slice(-20);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...trimmed,
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "Omlouvám se, zkuste to znovu.";

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Chyba při komunikaci s asistentem." },
      { status: 500 }
    );
  }
}
