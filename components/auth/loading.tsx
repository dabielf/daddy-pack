import Image from "next/image";

export const Loading = () => {
  return (
    <main className="flex w-screen justify-center items-center h-screen bg-white">
      <Image
        src="/logo.svg"
        alt="logo"
        width={300}
        height={100}
        className="animate-pulse duration-700 m-auto"
      />
    </main>
  );
};
