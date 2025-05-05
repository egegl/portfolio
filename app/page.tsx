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
          <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sagittis, leo quis aliquam bibendum, erat mi placerat dui, sed condimentum sapien dui ut arcu. Donec in nulla in elit eleifend elementum et a tortor. Curabitur lectus augue, cursus sed semper et, egestas vitae orci. Fusce orci metus, accumsan at dui id, finibus maximus arcu. Ut in nunc in leo semper lacinia quis vel nulla. Donec eu leo volutpat, interdum erat vitae, facilisis elit. Mauris ut nulla eget nibh commodo efficitur. Aliquam blandit enim nisl, eget fringilla nisi vehicula quis. Nunc pharetra ac ipsum ultrices finibus.
          </p>
          <br/>
          <p>
              Duis vitae volutpat mi, ut blandit augue. Ut rutrum purus et mi ornare venenatis. Etiam lobortis neque ac neque mattis, sed suscipit risus accumsan. Nullam a consectetur sapien, gravida mattis libero. Suspendisse quis fermentum ipsum. Aenean malesuada pharetra volutpat. Curabitur tincidunt in odio in dignissim. Praesent viverra ante eget purus ornare imperdiet. Etiam et vehicula tortor.
          </p>
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
                <b>Chat with EgeBot</b>
            </p>
          <ChatBox />
        </div>
        <Footer />
      </main>
  );
}