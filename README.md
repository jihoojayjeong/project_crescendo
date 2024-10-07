Here’s the revised version of your README with emojis and additional content from your resume, including Docker and other key points:

---

# 🚀 Crescendo Research Project  

**Technical Stack**: Node.js, React, Express, MongoDB (NoSQL), Nginx, Docker  

### **🎯 Motivation**  
Many undergraduate courses, particularly at the senior level, incorporate project-based learning. Capstone courses in the Computer Science department at Virginia Tech aim to synthesize skills learned throughout the curriculum, emphasizing teamwork, design, and communication ([link](https://cs.vt.edu/Undergraduate/courses.html#capstones)).

In these courses, professors often ask students to give milestone presentations to assess progress and provide feedback. While peer assessment can improve learning outcomes, it can also introduce challenges, such as inconsistent grading and discomfort with peers determining grades ([link](https://www.tandfonline.com/doi/abs/10.1080/02602938.2019.1600186)).

### **🛠️ Solution: PI’s Peer-Review Feedback System**  
Professor Lee developed a peer-review system for his **Creative Computing Studio** capstone course. Students provide anonymous feedback on team presentations, and the presenting team evaluates the quality of feedback based on criteria like specificity and actionability. This system fosters a sense of community and encourages constructive feedback ([link](https://dl.acm.org/doi/pdf/10.1145/3173574.3173629)).

Key benefits include:
- 💬 **Constructive feedback**: Students are incentivized to provide meaningful feedback as it affects their grade.
- 📊 **Crowdsourced insights**: Teams take peer feedback more seriously due to consistent themes across evaluations.
- 🌱 **Community building**: Regular feedback creates a collaborative environment where students witness each team’s growth.

### **🚢 Deployment Instructions**  
- **⚠️ Important**: Deploy **only** on the `master` branch due to domain restrictions.  
- We use a custom `deploy.sh` script for deploying the backend server.  

#### **Steps to Build and Deploy**:
1. Run `bash deploy.sh` on the local server.  
2. Enter the server IP address, username, and password when prompted.  
3. After deployment is complete, access the website via the public IP address.

### **📦 Docker and CI/CD Automation**  
We optimized the deployment process using Docker, reducing deployment time by 50%, CPU usage by 95%, and system call time by 71%. A custom CI/CD pipeline automates deployment, cutting deployment time by 60% and minimizing human errors during production releases.

### **👤 Dummy User Data**  
To generate dummy user data, use the `scripts/seed.js` file.

#### **Steps to Run the Script**:
1. Run `node scripts/seedUsers.js` on the local server.  
2. Use `addUsersToCourse.js` to add users to a course. Make sure to input the correct `courseId`.  
3. After running the script, access the website via the public IP address.
