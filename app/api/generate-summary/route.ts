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
    const topCategory = Object.entries(data.categories).sort(([, a], [, b]) => b - a)[0]

    const summaries = {
      daily: `You spent $${data.totalSpent} today. Your biggest expense was ${topCategory[0]} at $${topCategory[1]}. Keep an eye on discretionary spending!`,
      weekly: `This week's total: $${data.totalSpent}. ${topCategory[0]} was your top category. Consider setting spending limits to stay on budget.`,
      monthly: `Monthly overview: $${data.totalSpent} spent. ${topCategory[0]} represents your largest expense category at $${topCategory[1]}. Great tracking progress!`,
    }

    const summary = summaries[timePeriod as keyof typeof summaries] || "Your spending is on track this period!"

    return Response.json({ summary })
  } catch (error) {
    console.error("Summary generation error:", error)
    return Response.json(
      { error: "Failed to generate summary", summary: "Your spending is on track this period!" },
      { status: 500 },
    )
  }
}
