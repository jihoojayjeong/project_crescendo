# 🚀 Crescendo Research Project

## 📚 Table of Contents
- [Project Description](#project-description)
- [Technical Stack](#technical-stack)
- [Motivation](#motivation)
- [Challenges with Peer Assessment](#challenges-with-peer-assessment)
- [PI’s Teaching Practice to Address the Problem](#pis-teaching-practice-to-address-the-problem)
  - [🌟 Peer-Review Feedback System](#peer-review-feedback-system)
  - [📈 Key Benefits](#key-benefits)
- [🚢 Deployment Instructions](#deployment-instructions)
  - [⚠️ Important](#important)
  - [🔧 How to Build and Deploy](#how-to-build-and-deploy)
  - [📦 Docker and CI/CD Automation](#docker-and-cicd-automation)
  - [👤 Dummy User Data](#dummy-user-data)
- [📌 Additional Notes](#additional-notes)
- [📝 License](#license)
- [🤝 Contributing](#contributing)
- [📧 Contact](#contact)

---

## 📄 Project Description
The **Crescendo Research Project** aims to enhance project-based learning outcomes through innovative peer-review systems and optimized deployment processes. This project integrates modern technologies and pedagogical strategies to foster a collaborative and efficient learning environment.

---

## 🛠️ Technical Stack
- **Backend:** Node.js, Express
- **Frontend:** React
- **Database:** MongoDB (NoSQL)
- **Server:** Nginx
- **Containerization:** Docker

---

## 🎯 Motivation
Many undergraduate courses, especially senior-level courses, incorporate project-based learning. For instance, Virginia Tech’s Computer Science department offers capstone courses designed to synthesize skills and knowledge acquired throughout the CS curriculum. These courses emphasize teamwork and communication, both written and oral.

In such project-based courses, professors typically require milestone presentations to monitor progress, provide feedback, and allow students to observe the advancements of other teams. Feedback from these presentations can help teams refine their projects and achieve successful final outcomes.

---

## 🛡️ Challenges with Peer Assessment
While peer assessment can lead to positive learning outcomes, it also presents several challenges:
- **Inconsistent Grading:** Individual grading standards may vary.
- **Potential for System Gaming:** Some students might manipulate assessments in their favor.
- **Low Participation:** It can be challenging for instructors to elicit active participation.
- **Comfort Levels:** Students may feel uncomfortable allowing peers to influence their grades.

---

## 💡 PI’s Teaching Practice to Address the Problem

### 🌟 Peer-Review Feedback System
Professor Lee developed a novel peer-review feedback system for his **Creative Computing Studio** capstone course, which has been refined over four iterations. The system includes:

1. **Providing Feedback**
   - After each group presentation, students provide feedback to the presenting teams.
   - Feedback is collected via an online survey with three sections:
     - **I like (Positives)**
     - **I wish (Improvements)**
     - **What if (Suggestions)**

2. **Evaluating Feedback**
   - Presenting teams evaluate the quality of the feedback they received based on criteria such as:
     - **Specificity**
     - **Justification**
     - **Actionability**
     - **Positivity**

3. **Grading**
   - Each student receives grades from nine different teams, which contribute to their final assignment grade (5% of the course grade).

### 📈 Key Benefits
- **Constructive Feedback:** Motivates students to provide meaningful feedback as it directly impacts their grades.
- **Crowdsourced Insights:** Teams receive valuable feedback with consistent themes, enhancing credibility.
- **Community Building:** Regular feedback fosters a collaborative environment where students can witness each team’s growth.

---

## 🚢 Deployment Instructions

### ⚠️ Important
**DO NOT DEPLOY ON ANY BRANCH OTHER THAN MASTER!** Due to domain limitations, deployment using GitHub Actions is restricted. Instead, use the `deploy.sh` script for backend server deployment.

### 🔧 How to Build and Deploy
1. **Run the Deployment Script:**
   ```bash
   bash deploy.sh
