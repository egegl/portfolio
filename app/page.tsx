import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatBox from '../components/ChatBox';
import PhotoOfTheDay from '../components/PhotoOfTheDay';
import './page.css';

export default async function Home() {
  return (
    <main className="main-container">
      <Navbar/>
      <div className="section">
        <p className="section-title">
          <b>About Me</b>
        </p>
        <p className="section-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sagittis, leo quis aliquam bibendum, erat mi placerat dui, sed condimentum sapien dui ut arcu. Donec in nulla in elit eleifend elementum et a tortor. Curabitur lectus augue, cursus sed semper et, egestas vitae orci. Fusce orci metus, accumsan at dui id, finibus maximus arcu. Ut in nunc in leo semper lacinia quis vel nulla. Donec eu leo volutpat, interdum erat vitae, facilisis elit. Mauris ut nulla eget nibh commodo efficitur. Aliquam blandit enim nisl, eget fringilla nisi vehicula quis. Nunc pharetra ac ipsum ultrices finibus.
        </p>
        <p className="section-text">
          Duis vitae volutpat mi, ut blandit augue. Ut rutrum purus et mi ornare venenatis. Etiam lobortis neque ac neque mattis, sed suscipit risus accumsan. Nullam a consectetur sapien, gravida mattis libero. Suspendisse quis fermentum ipsum. Aenean malesuada pharetra volutpat. Curabitur tincidunt in odio in dignissim. Praesent viverra ante eget purus ornare imperdiet. Etiam et vehicula tortor.
        </p>
        <a href="/contact" className="section-link">
          ◡̈ <u>Contact Me</u> ◡̈
        </a>
      </div>
      <div className="section">
        <p className="section-title">
          <b>My Skills</b>
        </p>
        <p className="section-text"><b>Programming Languages: </b>(Proficient) Python, Java, C#, C++
          (Familiar) HTML, CSS, JavaScript, TypeScript</p>
        <p className="section-text"><b>Frameworks & Libraries: </b>Next.js, Node.js, Express, Flask,
          Biopython, PyTorch, Matplotlib, TensorFlow</p>
        <p className="section-text"><b>Tools & Platforms: </b>Docker, AWS, GCP, Firebase, Hugging Face</p>
        <p className="section-text"><b>Other Programs: </b>Unity, Unreal Engine, Blender, Adobe
          Lightroom/Premiere Pro/Photoshop, Microsoft 365, JetBrains Suite, Visual Studio, VSCode</p>
        <p className="section-text">I'm always looking to learn new skills and technologies!</p>
      </div>
      <div className="section">
        <p className="section-title">
          <b>My Projects</b>
        </p>
        <a href="https://github.com/egegl" className="section-link">
          <u>GitHub</u>
        </a>
      </div>
      <div className="section">
        <p className="section-title">
          <b>Photo of the Day (taken by me!)</b>
        </p>
        <PhotoOfTheDay />
      </div>
      <div className="section">
        <p className="section-title">
          Chat with EgeBot (ask for coding help!)
        </p>
        <ChatBox />
      </div>
      <Footer />
    </main>
  );
}