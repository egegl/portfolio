import ChatBox from '../../components/ChatBox';
import Navbar from "@/components/Navbar";

export const metadata = {
  title: 'Chat with AI',
};

export default function ChatPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6">
        <Navbar />
      <h1 className="text-2xl font-bold mb-4">Chat with AI :)</h1>
      <ChatBox />
    </main>
  );
}