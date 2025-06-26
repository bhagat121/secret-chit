"use client";

import dynamic from "next/dynamic";

const SecretClientView = dynamic(() => import("./SecretClientView"), {
  ssr: false,
});

export default function SecretClientWrapper({ id }: { id: string }) {
  return <SecretClientView id={id} />;
}
