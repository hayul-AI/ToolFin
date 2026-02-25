class CalculatorInfoSections extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const title = this.getAttribute('title') || document.title.replace(' - ToolFin', '').replace(' Calculator', '');
    this.render(title);
  }

  render(title) {
    const style = `
      <style>
        :host {
          display: block;
          margin-top: 4rem;
          font-family: 'Inter', sans-serif;
          color: #1e293b;
          line-height: 1.6;
        }
        section {
          margin-bottom: 3rem;
        }
        h2 {
          font-size: 1.875rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          color: #0f172a;
        }
        h4 {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #334155;
        }
        p {
          margin-bottom: 1rem;
          color: #475569;
        }
        ul {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        li {
          margin-bottom: 0.5rem;
          color: #475569;
        }
        .faq-grid {
          display: grid;
          gap: 1.5rem;
          margin-top: 1.5rem;
        }
        .disclaimer-box {
          margin-top: 4rem;
          padding: 2rem;
          background: #f1f5f9;
          border-radius: 12px;
          font-size: 0.9rem;
          color: #64748b;
        }
        .disclaimer-box strong {
          color: #475569;
        }
      </style>
    `;

    const content = `
      <section>
        <h2>Result Interpretation</h2>
        <p>The results from the ${title} Calculator provide a mathematical projection based on the specific inputs you provided. Typically, these figures can indicate the general direction of your financial situation or the potential scale of a specific decision. For most users, these numbers may serve as a starting point for deeper investigation or as a way to compare different "what-if" scenarios.</p>
        <p>It is important to remember that financial outcomes are often influenced by variables that cannot be fully captured in a simple calculator, such as market volatility, individual credit profiles, or changing economic conditions. Therefore, the outputs should be viewed as estimates that can help you understand the potential impact of various factors on your total cost or savings.</p>
        <p>Typically, a higher result in one category may suggest more flexibility in your budget, while a lower result might indicate a need for more conservative planning. Users often find that adjusting small variables can lead to significant changes in long-term projections, highlighting the sensitivity of financial models to individual inputs.</p>
      </section>

      <section>
        <h2>What This Calculator Does</h2>
        <p>The ${title} Calculator is designed to simplify complex financial estimations by automating the underlying mathematical principles. People use this tool to quickly visualize the relationship between different financial variables—such as income, debt, interest rates, or time—without needing to manually perform advanced calculations. Whether you are planning for a major purchase or tracking your progress toward a milestone, this tool helps bring clarity to the numbers.</p>
      </section>

      <section>
        <h2>How the Result Is Calculated</h2>
        <p>The result is derived from standard mathematical principles relevant to ${title.toLowerCase()} analysis. At its core, the calculator processes your inputs through a series of logical steps that balance various factors against each other. For instance, it typically combines fixed values with variable rates to determine a final outcome, often accounting for the effects of time or recurring cycles. The objective is to provide a consistent and objective figure that reflects the mathematical reality of the data provided.</p>
      </section>

      <section>
        <h2>Example Scenario</h2>
        <p>Consider a hypothetical scenario where a user enters a base amount of $10,000 with an expected annual change of 5%. After processing these inputs through the ${title} model, the calculator might output a final result that shows how that initial amount evolves over a set period. In this example, the user can see how the interplay between the starting figure and the rate of change produces a specific ending value, helping to illustrate the practical application of the tool.</p>
      </section>

      <section>
        <h2>Frequently Asked Questions (FAQ)</h2>
        <div class="faq-grid">
          <div>
            <h4>How accurate are these estimates?</h4>
            <p>The calculations are mathematically precise based on the inputs provided, but they are estimates of real-world outcomes which may vary due to external factors.</p>
          </div>
          <div>
            <h4>Should I base my final decision on this result?</h4>
            <p>This tool is intended for educational purposes. Major financial decisions should typically involve consultation with a qualified professional.</p>
          </div>
          <div>
            <h4>What variables have the biggest impact?</h4>
            <p>Generally, time horizons and interest rates (or rates of change) tend to have the most significant effect on long-term financial projections.</p>
          </div>
          <div>
            <h4>Does this account for local taxes or fees?</h4>
            <p>Unless specifically noted in the input fields, general calculators often omit specific local variables to maintain a broadly applicable model.</p>
          </div>
        </div>
      </section>

      <div class="disclaimer-box">
        <p><strong>Legal Disclaimer:</strong> All results provided by ToolFin are mathematical estimates for educational purposes only. They do not constitute financial, investment, tax, or legal advice. Actual terms and amounts vary by lender, provider, and jurisdiction. Users should consult qualified professionals for personal financial decisions.</p>
      </div>
    `;

    this.shadowRoot.innerHTML = style + content;
  }
}

customElements.define('calculator-info-sections', CalculatorInfoSections);
