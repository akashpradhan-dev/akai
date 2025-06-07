"use client";
import { useMessageList } from "@/services/querys/getMessages";
import { useParams } from "next/navigation";
import React from "react";
import { MarkdownWithSyntaxHighlight } from "../Markdown";
import { useGetHistoryById } from "@/services/querys/getHistoryById";
import { HistorySidebar } from "../new/history-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";

const Messages = () => {
  const { id } = useParams();

  const { data, isPending, error, isError } = useMessageList({
    chat_id: id?.toString() || "",
  });

  const { data: history, isPending: historyPending } = useGetHistoryById({
    chatId: id?.toString() || "",
  });

  if (isPending || historyPending) {
    <span className="text-stone-50">Loading...</span>;
  }

  if (isError) {
    <span>Encounred error while fetching messages: {error.message}</span>;
  }

  const content = data?.map((message) => message.content);
  const messages = content?.flatMap((pair) => [pair.user, pair.bot]);

  return (
    <>
      <HistorySidebar>
        <SidebarInset>
          <SiteHeader title={history?.title} />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div>
                  {messages?.length === 0 ? (
                    <h1>No message found</h1>
                  ) : (
                    <div className="flex flex-col gap-4 w-full">
                      <div className="flex flex-col gap-2">
                        {messages?.map((message, i) => (
                          <div key={i} className="flex flex-col gap-2">
                            <div
                              className={`p-3 md:p-5 text-sm rounded-2xl max-w-[95%] overflow-x-auto md:max-w-[90%] whitespace-pre-wrap ${
                                message.role === "user"
                                  ? "bg-[#171717] self-end text-white"
                                  : "border border-[#2c2937]"
                              }`}
                            >
                              <MarkdownWithSyntaxHighlight
                                markdownText={message.parts[0].text}
                              />
                            </div>
                          </div>
                        ))}
                        {/* <div ref={messagesEndRef} /> */}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </HistorySidebar>
      ;
    </>
  );
};

export default Messages;
