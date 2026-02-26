# Facilitator Guide

This guide helps facilitators deliver the AI Engineering Workshop effectively.

## Workshop Overview

| Session | Duration | Focus |
|---------|----------|-------|
| 01 | 60 min | Environment setup, LLM fundamentals |
| 02 | 75 min | Backend development with Copilot |
| 03 | 75 min | Frontend development with AI |
| 04 | 60 min | Integration and testing |
| 05 | 60 min | Azure deployment |

**Total:** ~5.5 hours + breaks

## Preparation Checklist

### One Week Before

- [ ] Verify Azure subscription has sufficient quota
- [ ] Create resource group and Azure OpenAI resource
- [ ] Test the workshop in a fresh Codespace
- [ ] Prepare Azure credentials for participants
- [ ] Send pre-workshop email with GitHub account requirements

### Day Before

- [ ] Verify all Codespaces can be created
- [ ] Test Azure OpenAI endpoint
- [ ] Prepare backup credentials
- [ ] Review common troubleshooting scenarios

### Day Of

- [ ] Arrive 30 minutes early
- [ ] Test projector/screen sharing
- [ ] Open reference materials
- [ ] Have troubleshooting commands ready

## Session Timing

### Session 01 (60 minutes)

| Time | Activity |
|------|----------|
| 0:00 | Introduction and objectives |
| 0:05 | Launch Codespaces (allow 5-10 min for setup) |
| 0:15 | Verify environments |
| 0:20 | LLM fundamentals presentation |
| 0:40 | Copilot hands-on exercises |
| 0:55 | Q&A and wrap-up |

**Key Points:**
- Don't rush the Codespace setup - first-time users may need help
- The LLM concepts are foundational - ensure understanding before moving on
- Encourage experimentation with Copilot

### Session 02 (75 minutes)

| Time | Activity |
|------|----------|
| 0:00 | Review backend structure |
| 0:10 | Start backend server |
| 0:15 | Copilot exercises (validation, new endpoint, error handling) |
| 0:45 | Azure OpenAI integration |
| 0:60 | Testing with Swagger UI |
| 0:70 | Q&A |

**Key Points:**
- Distribute Azure credentials early
- Have mock mode fallback ready
- Watch for Python environment issues

### Session 03 (75 minutes)

| Time | Activity |
|------|----------|
| 0:00 | Review frontend structure |
| 0:10 | Start frontend dev server |
| 0:15 | Component exercises |
| 0:45 | Tailwind styling |
| 0:55 | Frontend-backend integration |
| 0:70 | Q&A |

**Key Points:**
- Node.js version issues are common
- Some participants may be unfamiliar with React - pair them up
- Emphasize the pattern, not memorizing syntax

### Session 04 (60 minutes)

| Time | Activity |
|------|----------|
| 0:00 | End-to-end testing walkthrough |
| 0:15 | Writing tests with Copilot |
| 0:35 | Error boundaries and edge cases |
| 0:50 | Pre-deployment checklist |
| 0:55 | Q&A |

**Key Points:**
- Testing can be dry - keep it practical
- Focus on "why test" not just "how to test"
- Connect testing to deployment readiness

### Session 05 (60 minutes)

| Time | Activity |
|------|----------|
| 0:00 | Azure CLI setup and login |
| 0:10 | Deploy backend |
| 0:30 | Deploy frontend |
| 0:45 | Verify full deployment |
| 0:50 | Troubleshooting and wrap-up |

**Key Points:**
- Have pre-created resources as backup
- Deployment can take time - fill with discussion
- Celebrate successful deployments!

## Common Issues and Solutions

### Codespace Issues

**Problem:** Codespace creation fails
**Solution:** Check org permissions, try personal account

**Problem:** Extensions not installed
**Solution:** Manually install from Extensions sidebar

**Problem:** Port forwarding not working
**Solution:** Check "Ports" tab, make visibility public

### Backend Issues

**Problem:** Module not found errors
**Solution:** Activate the virtual environment (`source src/backend/.venv/bin/activate`) then `pip install -r requirements.txt` in the `src/backend` directory

**Problem:** VS Code prompts to create a virtual environment
**Solution:** A venv is created automatically in Codespaces by the devcontainer setup. If running locally, follow the venv instructions in SESSION-02

**Problem:** Azure OpenAI timeout
**Solution:** Check endpoint URL, API key, switch to mock mode

**Problem:** CORS errors
**Solution:** Verify frontend origin in allowed_origins list

### Frontend Issues

**Problem:** npm install fails
**Solution:** Clear node_modules, npm cache clean --force

**Problem:** TypeScript errors
**Solution:** Often type definition issues - show how to use `any` temporarily

**Problem:** Vite proxy not working
**Solution:** Verify backend is running on port 8000

### Deployment Issues

**Problem:** az login hangs
**Solution:** Try `az login --use-device-code`

**Problem:** Deployment fails with permission error
**Solution:** Verify subscription access, resource group permissions

**Problem:** App Service shows "Application Error"
**Solution:** Check logs with `az webapp log tail`

## Slide Outline (Optional)

If you want to create slides for the workshop:

### Welcome (5 slides)
1. Title slide
2. Agenda overview
3. Learning objectives
4. Prerequisites check
5. Introductions

### LLM Fundamentals (10 slides)
1. What is an LLM?
2. How training works
3. Tokens explained
4. Context windows
5. Temperature
6. Chat vs completion
7. Azure OpenAI overview
8. Copilot architecture
9. When to use which tool
10. Hands-on preview

### Workshop Flow (5 slides)
1. What we're building
2. Architecture diagram
3. Technology stack
4. Session roadmap
5. Let's get started!

## Post-Workshop

### Feedback Collection

Send survey within 24 hours covering:
- Session pacing
- Content difficulty
- Most valuable learnings
- Areas for improvement
- Interest in advanced topics

### Follow-up Resources

Share with participants:
- Link to this repository
- AIRE Reference Architecture
- Azure OpenAI documentation
- Copilot best practices guide
- Internal Slack/Teams channel for questions

## Notes for Next Time

Document what worked and what didn't:

```
Date: ___________
Participants: ___________
Issues encountered:
-
-
What worked well:
-
-
What to change:
-
-
```
