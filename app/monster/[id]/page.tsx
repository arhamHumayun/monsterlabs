export default function Page(
  { params }: { params: { id: string } }
) {
  return (
    <div>
      <h1>Monster Page </h1>
      <p>Monster ID: {params.id}</p>
    </div>
  )
}