# 🚀 Crescendo Research Project

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
2. **Provide Server Details When Prompted:**
   - **Server IP Address**
   - **Username**
   - **Password**

3. **Access the Website:**
   - After deployment, visit the website using the provided public IP address.

---

### 📦 Docker and CI/CD Automation

The deployment process is optimized using Docker, achieving significant improvements:

- **Deployment Time:** Reduced by 50%
- **CPU Usage:** Reduced by 95%
- **System Call Time:** Reduced by 71%

A custom CI/CD pipeline automates the deployment process, cutting deployment time by 60% and minimizing human errors during production releases.

---

### 👤 Dummy User Data

To generate dummy user data, use the `scripts/seed.js` file.

#### Steps to Run the Script

1. **Run the Seed Users Script:**
   ```bash
   node scripts/seedUsers.js
3. **Access the Website:**
   - After running the scripts, access the website via the public IP address.

---

### 📌 Additional Notes

- **Environment Variables**
  - Ensure all necessary environment variables are set in the `.env.development` file.

- **Common Issues**
  - If you encounter the following error during `npm start`:
    ```
    TypeError: Router.use() requires a middleware function
    ```

---

### 📝 License

This project is licensed under the MIT License.

---

### 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

---

### 📧 Contact

For any inquiries or issues, please contact [your.email@example.com](mailto:jghdg1234@gmail.com).
