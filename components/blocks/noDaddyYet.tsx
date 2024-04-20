import { NewDaddyButton } from './fastDaddyForm';

export default function NoDaddyYet() {
  return (
    <div className="flex flex-1 h-full items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          You have no daddies recorded yet
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          So what are you waiting for? It is time to...
        </p>
        <NewDaddyButton />
      </div>
    </div>
  );
}
