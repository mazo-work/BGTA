import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { timePeriod } = await request.json()

    // Mock financial data - in production, this would come from your database
    const spendingData = {
      daily: {
        totalSpent: 755,
        categories: { Housing: 200, Food: 150, Transport: 95, Entertainment: 50, Utilities: 30, Other: 230 },
        dayOfWeek: "Friday",
      },
      weekly: {
        totalSpent: 3185,
        categories: { Housing: 1200, Food: 620, Transport: 380, Entertainment: 320, Utilities: 150, Other: 515 },
        weekNumber: 1,
      },
      monthly: {
        totalSpent: 12600,
        categories: { Housing: 4800, Food: 2400, Transport: 1500, Entertainment: 1200, Utilities: 600, Other: 2100 },
        month: "January",
      },
    }

    const data = spendingData[timePeriod as keyof typeof spendingData]
    const categoriesText = Object.entries(data.categories)
      .map(([cat, amount]) => `${cat}: $${amount}`)
      .join(", ")

    const prompt = `Generate a concise, friendly financial summary for the user's ${timePeriod} spending. 
    Total spent: $${data.totalSpent}
    Category breakdown: ${categoriesText}
    
    Provide actionable insights (1-2 sentences max) about their spending habits and trends. Be encouraging and practical.`

    const { text } = await generateText({
      model: "openai/gpt-4-mini",
      prompt,
      temperature: 0.7,
      maxTokens: 150,
    })

    return Response.json({ summary: text.trim() })
  } catch (error) {
    console.error("Summary generation error:", error)
    return Response.json(
      { error: "Failed to generate summary", summary: "Your spending is on track this period!" },
      { status: 500 },
    )
  }
}
