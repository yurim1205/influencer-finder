import {mockChannels} from "@/mocks/channels";

export default async function ChannelPage({
    params
}: {
        params: Promise<{id: string}>
    }) {
    const { id } = await params;
    const channel = mockChannels.find(
        channel => channel.id === id
    );

    if (!channel) {
        return <div>채널 id 없음</div>;
    }

    return (
        <div>
            <h1>{channel.name}</h1>
            <p>{channel.description}</p>
            <p>{channel.subscribers}</p>
            <p>{channel.averageViews}</p>
        </div>
    )
}