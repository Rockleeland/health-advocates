import * as React from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export function Table({ headers, children }: TableProps) {
  return (
    <ScrollArea.Root className="w-full" type="always">
      <ScrollArea.Viewport className="w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="flex h-2 touch-none select-none bg-gray-100"
        orientation="horizontal"
      >
        <ScrollArea.Thumb className="relative flex-1 rounded-full bg-gray-300" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
