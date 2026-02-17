import { create } from "zustand";

interface InvitationModalState {
  isOpen: boolean;
  tenantId: string | null;
  tenantName: string | null;
  onOpen: (tenantId: string, tenantName: string) => void;
  onClose: () => void;
}

export const useInvitationModal = create<InvitationModalState>((set) => ({
  isOpen: false,
  tenantId: null,
  tenantName: null,
  onOpen: (tenantId, tenantName) =>
    set({
      isOpen: true,
      tenantId,
      tenantName,
    }),
  onClose: () =>
    set({
      isOpen: false,
      tenantId: null,
      tenantName: null,
    }),
}));
