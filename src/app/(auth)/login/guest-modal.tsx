import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

export const GuestModal = () => {
  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer">
        Click here to see the guest account
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Guest Account</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col gap-2">
              <p>
                Email:{" "}
                <span className="text-blue-500 font-bold">
                  {process.env.NEXT_PUBLIC_GUEST_EMAIL}
                </span>
              </p>
              <p>
                Password:{" "}
                <span className="text-blue-500 font-bold">
                  {process.env.NEXT_PUBLIC_GUEST_PASSWORD}
                </span>
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
