import { Link } from "wouter";

const NAVY = "#1b365d";
const GOLD = "#c5a572";

interface Term {
  term: string;
  shortDef: string;
  fullDef: string;
  example?: string;
}

const GLOSSARY_TERMS: Term[] = [
  {
    term: "Real Revenue",
    shortDef: "The money that actually belongs to you after paying pass-through costs.",
    fullDef: "Real Revenue is the foundation of the entire Profit First system. It is what is left after you subtract all the money that was never really yours to begin with -- stylist commissions, product costs used in services, retail inventory replacement, and employer payroll taxes. For most commission salons, Real Revenue is only 25 to 35 percent of total revenue. This is the number all your allocation percentages are based on.",
    example: "Example: Your salon collects $50,000 this month. After paying $18,000 in commissions, $3,000 in product costs, $2,700 in employer burden, and $4,000 in retail inventory, your Real Revenue is $22,300. That is the only money that belongs to the business."
  },
  {
    term: "Profit First",
    shortDef: "A cash management system where profit is taken first, not last.",
    fullDef: "Traditional accounting says Revenue minus Expenses equals Profit. The problem is that expenses always seem to expand to fill whatever is available, so profit ends up being whatever is left over -- which is often nothing. Profit First flips the formula: Revenue minus Profit equals Expenses. You allocate profit to a separate account before paying any bills. Then you run your business on what remains. This one change forces efficiency and guarantees you are building wealth, not just revenue.",
    example: "Example: If your Real Revenue is $10,000 and you allocate 5% to Profit first, you move $500 to your Profit account before paying anything else. Your business now runs on $9,500. Over time, that 5% grows to 10%, then 15%, and so does your wealth."
  },
  {
    term: "CPB (Commissions, Parts, Burden)",
    shortDef: "All the money that passes through your salon but was never yours to keep.",
    fullDef: "CPB stands for Commissions, Parts, and Burden. These are the three categories of pass-through costs that must be separated from your Real Revenue. Commissions are what you pay stylists on services and retail sales. Parts are the product costs used in services (color, developer, treatments) and the cost of retail inventory. Burden is the employer payroll taxes and fees you pay on top of W-2 wages (typically 10 to 18 percent of wages). All of this money goes into a dedicated CPB account and is never spent on operating expenses.",
    example: "Example: A stylist does $4,000 in services at 45% commission. That is $1,800 in commissions (CPB). The color and product used cost $400 (CPB). The employer burden on the commission is $270 (CPB). Total CPB for that stylist: $2,470."
  },
  {
    term: "TAPs (Target Allocation Percentages)",
    shortDef: "The percentage targets for each money bucket based on your Real Revenue level.",
    fullDef: "TAPs are the goal percentages for each of your four core accounts: Profit, Owner Pay, Tax Reserve, and Operating Expenses. They are based on your annual Real Revenue. Smaller salons have higher Owner Pay percentages because the owner is doing most of the revenue-generating work. Larger salons have higher Profit percentages because they have more leverage and efficiency. You do not start at your TAPs. You start where you are and move 1 percent per quarter from Operating Expenses to Profit until you reach your targets.",
    example: "Example: If your annual Real Revenue is $150,000, your TAPs are roughly: Profit 5-10%, Owner Pay 45-50%, Tax 10-15%, OPEX 30-40%. You start Profit at 1% and move up 1% every quarter."
  },
  {
    term: "OPEX (Operating Expenses)",
    shortDef: "Your true overhead -- the costs that exist whether you are busy or slow.",
    fullDef: "OPEX is the account that pays for everything it costs to keep the salon running, regardless of how much revenue you generate. This includes rent, utilities, insurance, marketing, software subscriptions, credit card processing fees, hourly or salaried staff wages (receptionists, assistants), education, and supplies. What does NOT go in OPEX: commissioned stylist pay (that is CPB), owner service pay (that is Owner Comp), profit allocations, and tax reserves. A healthy OPEX is 30 to 40 percent of Real Revenue. Above 45 percent is a red flag.",
    example: "Example: Your monthly OPEX includes rent ($3,500), utilities ($200), salon software ($150), credit card fees ($400), and a part-time receptionist ($1,200). Total OPEX: $5,450. If your Real Revenue is $15,000, that is 36% -- healthy."
  },
  {
    term: "Employment Burden",
    shortDef: "The extra cost of having W-2 employees on top of their wages.",
    fullDef: "When you hire W-2 employees, you pay more than just their wages. You also pay the employer share of FICA taxes (7.65%), workers compensation insurance (1 to 4% depending on your state), and state unemployment insurance (0.6 to 6%). Combined, this adds 10 to 18 percent on top of every dollar you pay in wages. Use 15 percent as a safe working estimate if you do not have the exact number from your payroll provider. This burden is part of CPB for commissioned employees and part of OPEX for hourly employees.",
    example: "Example: You pay a stylist $3,000 in commissions this month. At a 15% burden rate, the real cost to your business is $3,450. That extra $450 is employment burden and belongs in your CPB account."
  },
  {
    term: "Six-Account System",
    shortDef: "The six bank accounts that make Profit First work automatically.",
    fullDef: "The Profit First system uses six dedicated accounts to make money management automatic. (1) Income Account: all client payments land here first. (2) CPB Account: holds all pass-through obligations until paid out. (3) Profit Account: kept at a separate, inconvenient bank with no debit card. (4) Owner Compensation Account: your regular salary for work performed. (5) Tax Account: also at the separate bank, never touched except for tax payments. (6) OPEX Account: pays all true operating expenses. On each allocation day, you move money from Income to each account based on your percentages. The system works because the accounts create natural spending limits.",
    example: "Example: On the 10th of the month, you move money from your Income account: 1% to Profit, 35% to Owner Comp, 12% to Tax, 32% to OPEX, and the rest to CPB. Each account now has its job and its limit."
  },
  {
    term: "Debt Destroyer",
    shortDef: "A seventh account added only after your system is stable, used exclusively to pay off business debt.",
    fullDef: "The Debt Destroyer is an optional seventh account added to the system after you have reached the Stability stage AND maintained consistent allocations for at least 90 consecutive days. It is funded by a fixed percentage of Real Revenue taken before other allocations, and used exclusively for loan payments. When the loan is paid off, that percentage automatically becomes Profit. Opening it too early pulls money from core accounts before the system is stable and creates more problems, not fewer.",
    example: "Example: You have a $40,000 equipment loan. Once your system is stable, you allocate 5% of Real Revenue to your Debt Destroyer account each allocation day. At $15,000 monthly Real Revenue, that is $750 per month dedicated to eliminating the debt."
  },
  {
    term: "Profit Distribution",
    shortDef: "Taking your profit reward every 13 weeks.",
    fullDef: "Every 13 weeks (quarterly), you take 50 percent of your Profit account as a personal distribution. This is your reward for owning the business and taking the risk. The other 50 percent stays in the account to build reserves. During the reserve-building phase (before you have 3 months of OPEX saved), take only 25 percent and leave 75 percent to build faster. Once reserves hit the 3-month target, return to the 50/50 split.",
    example: "Example: After 13 weeks, your Profit account has $4,200. You take $2,100 as a personal distribution and leave $2,100 in the account. This is not a bonus. This is the system working exactly as designed."
  },
  {
    term: "Retail COGS",
    shortDef: "The cost of the retail products you sell, reserved for inventory replacement.",
    fullDef: "When you sell a retail product, roughly 50 percent of that sale price is the cost of the product itself (what you paid wholesale). That money is not income -- it belongs in your CPB account to replace the inventory you just sold. If you spend retail revenue on operating expenses, you will eventually run out of products to sell and have no money to reorder. The industry standard is a 50 percent gross margin on retail, meaning if a product costs $10 wholesale, it retails for $20.",
    example: "Example: Your salon sells $5,000 in retail this month. $2,500 goes to CPB for inventory replacement (COGS). The stylist who sold it earns a 10% retail commission ($500, also CPB). Only $2,000 of that $5,000 is Real Revenue."
  },
  {
    term: "Booked Percentage",
    shortDef: "How full your stylists' schedules are.",
    fullDef: "Booked percentage measures how much of your available appointment time is actually filled with paying clients. A healthy range is 75 to 85 percent. Below 60 percent signals a serious retention or marketing problem. Above 90 percent means you are at capacity and need to either raise prices or add staff. Booked percentage tells you whether a revenue problem is a pricing problem or a volume problem. A stylist at 60% booked who raises prices will often outperform a stylist at 90% booked who has not raised prices in two years.",
    example: "Example: A stylist works 40 hours per week and has 30 hours of appointments booked. Their booked percentage is 75% -- healthy and sustainable."
  },
  {
    term: "Survival Stage",
    shortDef: "Under $8,333 per month in Real Revenue (under $100K annually).",
    fullDef: "The Survival stage is where most new salon owners and many struggling established salons operate. At this level, the owner is typically doing most of the revenue-generating work themselves. The priority is getting the system set up, starting Profit at 1%, and building the habit of allocation. Owner Compensation is the highest percentage because the owner is the primary producer. The goal is to move to Stability by growing Real Revenue and tightening expenses.",
  },
  {
    term: "Stability Stage",
    shortDef: "Between $8,333 and $20,833 per month in Real Revenue ($100K to $250K annually).",
    fullDef: "The Stability stage is where the salon has enough revenue to begin building real systems. The owner is starting to delegate some revenue-generating work to staff. Profit allocation begins to grow. Tax reserves are fully funded. The focus is on efficiency, team development, and preparing for growth. This is also the stage where the Debt Destroyer account can be added if business debt exists.",
  },
  {
    term: "Growth Stage",
    shortDef: "Between $20,833 and $41,667 per month in Real Revenue ($250K to $500K annually).",
    fullDef: "The Growth stage is where the salon has proven its model and is ready to scale. The owner is shifting from service delivery to management. Profit percentages increase. The team is more developed. Marketing and systems become the focus. The risk at this stage is adding overhead too fast -- hiring before revenue justifies it, expanding space before the team fills it.",
  },
  {
    term: "Scale Stage",
    shortDef: "Over $41,667 per month in Real Revenue (over $500K annually).",
    fullDef: "The Scale stage is where the salon operates as a true business, not just a job for the owner. The owner's role is primarily management, vision, and leadership. Profit percentages are at their highest. Multiple locations or revenue streams may exist. The focus is on protecting what has been built, optimizing systems, and creating legacy.",
  },
  {
    term: "Parts and Labor",
    shortDef: "A separate charge for color and chemical service costs collected from clients.",
    fullDef: "Some salons charge clients a separate 'parts and labor' or 'color charge' fee on top of the service price to cover the actual cost of color, developer, and chemical products used. This money is not pure retail revenue -- the 'parts' portion belongs in CPB to cover product costs. When calculating Real Revenue, parts and labor charges must be analyzed separately from retail product sales to avoid overstating income.",
    example: "Example: A client pays $50 for a color service and an additional $25 parts and labor charge. The $25 covers the actual product cost. It goes to CPB, not to Real Revenue."
  },
  {
    term: "Average Ticket",
    shortDef: "The average amount each client spends per visit.",
    fullDef: "Average ticket is calculated by dividing total revenue by the number of clients seen in a period. It is one of the most powerful levers for growing revenue without adding more clients. The industry benchmark for commission salons is $95 to $135 per visit. For booth rental salons, $75 to $110 is typical. Raising your average ticket by $20 per client across 200 monthly clients adds $4,000 per month in revenue with no additional overhead.",
    example: "Example: Your salon sees 180 clients per month and collects $22,500 in service revenue. Average ticket = $22,500 / 180 = $125. That is healthy for a commission salon."
  },
  {
    term: "Revenue Per Employee",
    shortDef: "How much Real Revenue each full-time employee generates.",
    fullDef: "Revenue per employee measures whether your team size is justified by your revenue. The minimum benchmark is $150,000 in annual Real Revenue per full-time equivalent employee. If you are below this, adding more staff will make the problem worse, not better. The fix is to grow revenue per existing employee through higher prices, better booking rates, or retail sales before adding headcount.",
    example: "Example: Your salon has 4 full-time stylists and generates $480,000 in annual Real Revenue. That is $120,000 per employee -- below the $150,000 benchmark. Adding a fifth stylist right now would reduce profitability further."
  },
];

export default function Glossary() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f0e8" }}>
      {/* Header */}
      <header style={{ backgroundColor: NAVY, padding: "0 2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 0" }}>
          <div>
            <div style={{ color: GOLD, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "2px" }}>
              The Level Up Academy
            </div>
            <div style={{ color: "white", fontSize: "1.3rem", fontWeight: 800, lineHeight: 1.1 }}>
              Profit First Glossary
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", marginTop: "2px" }}>
              Every term explained in plain English
            </div>
          </div>
          <Link href="/">
            <button style={{ padding: "0.5rem 1rem", backgroundColor: "transparent", color: GOLD, border: `1px solid ${GOLD}`, borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", letterSpacing: "0.03em" }}>
              Back to The AI Accountant
            </button>
          </Link>
        </div>
        <div style={{ height: "3px", backgroundColor: GOLD, margin: "0 -2rem" }} />
      </header>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>

        {/* Intro */}
        <div style={{ backgroundColor: NAVY, borderRadius: "10px", padding: "1.75rem 2rem", marginBottom: "2.5rem", color: "white" }}>
          <div style={{ color: GOLD, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Why This Glossary Exists
          </div>
          <p style={{ margin: "0 0 0.75rem", fontSize: "1rem", lineHeight: 1.7, fontWeight: 600 }}>
            The Profit First system uses specific language for a reason. Every term has a precise meaning that changes how you see your numbers.
          </p>
          <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.7, color: "rgba(255,255,255,0.8)" }}>
            When you read your AI Accountant report and see a term you do not recognize, come here. Each definition is written in plain English with a real-world salon example so you know exactly what you are looking at and what to do about it.
          </p>
        </div>

        {/* Quick Reference Table */}
        <div style={{ backgroundColor: "white", borderRadius: "10px", padding: "1.75rem 2rem", marginBottom: "2.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ color: NAVY, fontSize: "1rem", fontWeight: 800, marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: `2px solid ${GOLD}` }}>
            Quick Reference: The Four Money Buckets
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ backgroundColor: NAVY, color: "white" }}>
                  <th style={{ padding: "0.65rem 1rem", textAlign: "left", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.04em" }}>Account</th>
                  <th style={{ padding: "0.65rem 1rem", textAlign: "left", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.04em" }}>Its Job</th>
                  <th style={{ padding: "0.65rem 1rem", textAlign: "left", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.04em" }}>Healthy Range</th>
                  <th style={{ padding: "0.65rem 1rem", textAlign: "left", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.04em" }}>Red Line</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { account: "Profit", job: "Your reward for owning the business. Kept at a separate bank you do not touch.", range: "5-20% of Real Revenue", red: "0% -- no system" },
                  { account: "Owner Pay", job: "Your regular salary for the work you do in the business.", range: "30-50% of Real Revenue", red: "Below 20% or above 55%" },
                  { account: "Tax Reserve", job: "Money set aside for quarterly and annual tax payments.", range: "10-15% of Real Revenue", red: "Below 10%" },
                  { account: "OPEX", job: "All true overhead: rent, utilities, insurance, marketing, software.", range: "30-40% of Real Revenue", red: "Above 45%" },
                ].map((row, i) => (
                  <tr key={row.account} style={{ backgroundColor: i % 2 === 0 ? "white" : "#fafafa" }}>
                    <td style={{ padding: "0.65rem 1rem", fontWeight: 700, color: NAVY, borderBottom: "1px solid #ebebeb" }}>{row.account}</td>
                    <td style={{ padding: "0.65rem 1rem", color: "#444", borderBottom: "1px solid #ebebeb", lineHeight: 1.5 }}>{row.job}</td>
                    <td style={{ padding: "0.65rem 1rem", color: "#16a34a", fontWeight: 600, borderBottom: "1px solid #ebebeb" }}>{row.range}</td>
                    <td style={{ padding: "0.65rem 1rem", color: "#991b1b", fontWeight: 600, borderBottom: "1px solid #ebebeb" }}>{row.red}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stage Reference */}
        <div style={{ backgroundColor: "white", borderRadius: "10px", padding: "1.75rem 2rem", marginBottom: "2.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ color: NAVY, fontSize: "1rem", fontWeight: 800, marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: `2px solid ${GOLD}` }}>
            Quick Reference: The Four Stages
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
            {[
              { stage: "Survival", range: "Under $100K / year", monthly: "Under $8,333/mo Real Revenue", color: "#fee2e2", border: "#fca5a5", text: "#991b1b" },
              { stage: "Stability", range: "$100K - $250K / year", monthly: "$8,333 - $20,833/mo Real Revenue", color: "#fef3c7", border: "#fcd34d", text: "#92400e" },
              { stage: "Growth", range: "$250K - $500K / year", monthly: "$20,833 - $41,667/mo Real Revenue", color: "#d1fae5", border: "#6ee7b7", text: "#065f46" },
              { stage: "Scale", range: "Over $500K / year", monthly: "Over $41,667/mo Real Revenue", color: "#dbeafe", border: "#93c5fd", text: "#1e40af" },
            ].map((s) => (
              <div key={s.stage} style={{ backgroundColor: s.color, border: `1px solid ${s.border}`, borderRadius: "8px", padding: "1rem" }}>
                <div style={{ fontWeight: 800, fontSize: "1rem", color: s.text, marginBottom: "4px" }}>{s.stage}</div>
                <div style={{ fontSize: "0.78rem", color: s.text, fontWeight: 600, marginBottom: "4px" }}>{s.range}</div>
                <div style={{ fontSize: "0.72rem", color: s.text, opacity: 0.8 }}>{s.monthly}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Glossary */}
        <div style={{ color: NAVY, fontSize: "1rem", fontWeight: 800, marginBottom: "1.25rem", paddingBottom: "0.5rem", borderBottom: `3px solid ${GOLD}` }}>
          Full Glossary A to Z
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {GLOSSARY_TERMS.map((item) => (
            <div key={item.term} style={{ backgroundColor: "white", borderRadius: "10px", padding: "1.5rem 2rem", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", borderLeft: `4px solid ${GOLD}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "0.75rem" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Arial, sans-serif", fontSize: "1.1rem", fontWeight: 900, color: NAVY, marginBottom: "2px" }}>
                    {item.term}
                  </div>
                  <div style={{ fontSize: "0.875rem", color: GOLD, fontWeight: 700, fontStyle: "italic" }}>
                    {item.shortDef}
                  </div>
                </div>
              </div>
              <p style={{ margin: "0 0 0.75rem", fontSize: "0.9rem", lineHeight: 1.75, color: "#333" }}>
                {item.fullDef}
              </p>
              {item.example && (
                <div style={{ backgroundColor: "#f5f0e8", borderRadius: "6px", padding: "0.75rem 1rem", fontSize: "0.85rem", color: "#555", lineHeight: 1.65, fontStyle: "italic" }}>
                  {item.example}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div style={{ marginTop: "3rem", backgroundColor: NAVY, borderRadius: "10px", padding: "2rem", textAlign: "center", color: "white" }}>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Ready to run your numbers?
          </div>
          <p style={{ margin: "0 0 1.25rem", color: "rgba(255,255,255,0.75)", fontSize: "0.9rem" }}>
            Now that you know the language, go back and run your Profit First analysis.
          </p>
          <Link href="/">
            <button style={{ padding: "0.75rem 2rem", backgroundColor: GOLD, color: "white", border: "none", borderRadius: "6px", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer" }}>
              Go to The AI Accountant
            </button>
          </Link>
        </div>

      </main>
    </div>
  );
}
