# Session 01: Environment Setup and LLM Fundamentals

**Duration:** 60 minutes

## Learning Objectives

By the end of this session, you will:
- Have a working development environment in GitHub Codespaces
- Understand what Large Language Models (LLMs) are and how they work
- Know the key concepts: tokens, context windows, and prompts
- Be ready to use GitHub Copilot for development

---

## Part 1: Environment Setup (15 minutes)

### Launch Your Codespace

1. Go to the repository: `github.com/crederauk/aire-ai-engineering-training-workshop`
2. Click the green **Code** button
3. Select the **Codespaces** tab
4. Click **Create codespace on main**

Wait for the environment to initialize. You'll see "Workshop environment ready!" when complete.

### Verify Your Setup

Open a terminal and run:

```bash
# Check Python
python --version  # Should show 3.11.x

# Check Node
node --version    # Should show 20.x

# Check the project structure
ls -la src/
```

### Enable GitHub Copilot

1. Look for the Copilot icon in the bottom-right of VS Code
2. If prompted, sign in with your GitHub account
3. Verify it shows "Copilot: Ready"

!!! tip "Working with Copilot Suggestions"
    Copilot's inline suggestions can feel clunky at first. Here are the key shortcuts:

    - **Accept full suggestion**: `Tab`
    - **Accept word-by-word**: `Ctrl+Right Arrow` (`Cmd+Right Arrow` on Mac)
    - **Dismiss suggestion**: `Esc`
    - **See alternatives**: `Alt+]` / `Alt+[`

    **Pro tip:** For multi-line or complex code, use **Copilot Chat** (`Ctrl+I` or `Cmd+I`) instead of inline completions. It gives you more control and better results for anything beyond simple one-liners. If a suggestion looks wrong, dismiss it (`Esc`) and try rephrasing your comment.

---

## Part 2: LLM Fundamentals (30 minutes)

### What is an LLM?

Large Language Models are AI systems trained on vast amounts of text to predict and generate human-like text. Think of them as sophisticated autocomplete systems that understand context and meaning.

**Key characteristics:**
- Trained on billions of words from books, websites, code repositories
- Can understand and generate multiple programming languages
- Work by predicting the most likely next token

### Understanding Tokens

LLMs don't see text the way we do. They break text into **tokens**:

```
"Hello, world!" → ["Hello", ",", " world", "!"]
"def calculate_sum" → ["def", " calculate", "_sum"]
```

**Why tokens matter:**
- Pricing is often per-token
- Context windows are measured in tokens
- Longer tokens = more efficient (common words/phrases)

### Context Windows

The **context window** is how much text the model can "see" at once:

| Model | Context Window |
|-------|----------------|
| GPT-4o-mini | 128K tokens |
| GPT-4o | 128K tokens |
| Claude 3.5 | 200K tokens |

This is roughly 100-150 pages of text!

### Temperature and Creativity

**Temperature** controls randomness:
- `0.0` = Deterministic, always picks most likely token
- `0.7` = Balanced creativity
- `1.0+` = Very creative, sometimes nonsensical

For code: Use low temperature (0.1-0.3)
For creative writing: Use higher temperature (0.7-0.9)

---

## Part 3: Hands-on with Copilot (15 minutes)

### Exercise 1: Autocomplete

Create a new file `src/backend/app/utils.py`:

```python
# Type this and wait for Copilot suggestions:
def calculate_average(numbers):
    """Calculate the average of a list of numbers."""
```

Let Copilot complete the function. Press `Tab` to accept.

### Exercise 2: Comment-Driven Development

In the same file, type:

```python
# Function to validate email addresses using regex
```

Watch Copilot generate a complete function from your comment!

### Exercise 3: Chat Interface

1. Open Copilot Chat (Cmd+Shift+I or click the chat icon)
2. Ask: "Explain what the /review endpoint does in src/backend/app/main.py"
3. Try: "How would I add rate limiting to this API?"

---

## Key Takeaways

1. **LLMs predict tokens** - They're pattern matchers, not "thinkers"
2. **Context is everything** - Better context = better suggestions
3. **Copilot accelerates, not replaces** - You're still the engineer
4. **Iterate and refine** - First suggestion isn't always best

---

## Next Session Preview

In Session 02, we'll build out the backend API using Copilot to:
- Complete the code review endpoint
- Add input validation
- Handle errors gracefully

---

<details>
<summary><strong>Deep Dive: How LLMs Actually Work</strong></summary>

### The Training Process

LLMs learn through a process called **unsupervised learning** on massive datasets:

1. **Data Collection**: Billions of words from diverse sources
2. **Tokenization**: Convert text to numerical representations
3. **Training**: Adjust billions of parameters to predict next tokens
4. **Fine-tuning**: Specialize for specific tasks (coding, chat, etc.)

### Attention Mechanism

The breakthrough that enabled modern LLMs is the **Transformer architecture** with its attention mechanism:

- Allows models to focus on relevant parts of input
- Enables understanding of long-range dependencies
- Makes parallel processing possible

### Emergent Capabilities

As models scale, they develop unexpected abilities:
- Few-shot learning (learning from examples in prompt)
- Chain-of-thought reasoning
- Code generation and debugging

</details>
