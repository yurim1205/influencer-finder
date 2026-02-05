import ChannelCard from "@/components/channel/ChannelCard";
import { mockChannels } from "@/mocks/channels";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="mb-12 max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-3">
           메인 문구
        </h1>
        <p className="text-gray-500">
          서브 문구 
        </p>
      </section>

      <section className="mb-8">
        <input
          placeholder="키워드를 입력하세요"
          className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockChannels.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </section>
    </main>
  )
}