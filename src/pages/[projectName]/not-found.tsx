import { Button } from "@/components/ui/button"

export default function ProjectNotFound() {
  return (
    <div className="container mx-auto py-16 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
      <p className="text-xl text-muted-foreground mb-8">We couldn't find the project you're looking for.</p>
      <Button asChild>
        <a href="/">Return Home</a>
      </Button>
    </div>
  )
}
