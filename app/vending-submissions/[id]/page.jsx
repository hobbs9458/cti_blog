"use client";

import { useEffect } from "react";

import { usePathname } from "next/navigation";

function Request() {
  const pathname = usePathname();
  const reqId = pathname.split("/").slice(-1)[0];

  useEffect(() => {
    async function getVendingRequest() {
      const res = await fetch(
        `${location.origin}/api/vending-request?id=${reqId}`
      );
      const data = await res.json();
      console.log(data);
    }
    getVendingRequest();
  }, []);

  return <div>Request Page...</div>;
}

export default Request;
