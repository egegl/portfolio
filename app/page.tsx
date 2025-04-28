import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatBox from '../components/ChatBox';

export default async function Home() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-6">
        <Navbar/>
        <div className="section">
          <p className="text-lg">
            <b>About Me</b>
          </p>
          <p>I'm a Computer Science and Math student at Emory University with a drive to build
            tech that creates real impact. I’ve led UN-backed robotics outreach across Turkey, mentored
            international FRC teams, and organized STEM education programs that reached thousands of underserved
            students. At Emory, I combine this passion for community with my technical skills, whether that’s
            through student organizations or building tools that connect people and ideas.</p>
          <br/>
          <p>I love problem-solving. I’ve worked on AI models for protein interface
            prediction, fine-tuned large language models for summarization and code generation, and built
            end-to-end systems using frameworks like PyTorch, TensorFlow, and Hugging Face. I also love creative
            expression through photography and game development!</p>
          <br/>
          <p>Right now, I’m exploring opportunities in tech consulting, software engineering, data science,
            and applied AI. Looking to join teams that value purpose and people. </p>
          <br/>
          <p>Let’s build something cool together!</p>
          <br/>
          <a href="/contact">
            ◡̈ <u>Contact Me</u> ◡̈
          </a>
        </div>
        <div className="section">
          <p className="text-lg">
            <b>My Skills</b>
          </p>
          <p><b>Programming Languages: </b>(Proficient) Python, Java, C#, C++
            (Familiar) HTML, CSS, JavaScript, TypeScript</p>
          <p><b>Frameworks & Libraries: </b>Next.js, Node.js, Express, Flask,
            Biopython, PyTorch, Matplotlib, TensorFlow</p>
          <p><b>Tools & Platforms: </b>Docker, AWS, GCP, Firebase, Hugging Face</p>
          <p><b>Other Programs: </b>Unity, Unreal Engine, Blender, Adobe
            Lightroom/Premiere Pro/Photoshop, Microsoft 365, JetBrains Suite, Visual Studio, VSCode</p>
          <p>I’m always looking to learn new skills and technologies!</p>
        </div>
        <div className="section">
          <p className="text-lg">
            <b>My Projects</b>
          </p>
            <br/>
          <a href="https://github.com/egegl">
            <u>GitHub</u>
          </a>
        </div>
        <div className="section">
          <p className="text-lg">
            <b>Photo of the Day</b>
          </p>
          <br/>
          <a href="https://gurselgallery.tumblr.com">
            <u>More photos on my photoblog!</u>
          </a>
        </div>
        <div className="section">
          <p className="text-lg">
            <b>Now Playing</b>
          </p>
          <br/>
          <iframe
              src="https://open.spotify.com/embed/track/5D7DtfpW0ULiafCYRrjnxk?utm_source=generator"
              width="300"
              height="80"
              allow="encrypted-media"
              className="rounded shadow-lg transition-all hover:scale-102 duration-300"
          ></iframe>
        </div>
        <div className="section">
            <p className="text-lg">
                <b>Chat with EgeBot</b>
            </p>
          <ChatBox />
        </div>
        <Footer />
      </main>
  );
}