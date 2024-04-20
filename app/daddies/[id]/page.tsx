export default function DaddyPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>This is the page with only one daddy</h1>
      <p>Here is the daddy id: {params.id}</p>
    </div>
  );
}
