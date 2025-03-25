import { useUserStore } from "@/store/user.store";
import RoleModal from "./RoleModal.vue";
import { createApp, DirectiveBinding } from "vue";
import { userHavePermission } from "@/globalFunctions/guardFunctions";
// import { IUserPermission } from "@/types/user.interface";

interface CustomHTMLElement extends HTMLElement {
  _roleDirective?: {
    modalApp: ReturnType<typeof createApp>
    modalInstance: any
  }
}

const userStore = useUserStore();
async function initUserStore() {
  const token = localStorage.getItem("token");
  if (token) {
    await userStore.getUserByToken();
  }
}
let userPermissions;
// @ts-ignore
if (!userStore.user) {
  await  initUserStore().then(() => {
    // @ts-ignore
    if (userStore.user && userStore.user.permissions) {
      // @ts-ignore
      userPermissions = userStore.user.permissions;
    }
  });
}
export default {
  mounted: async (el: CustomHTMLElement, binding: DirectiveBinding) => {
    const setupDirective = async () => {
      const { value } = binding;

      const modalApp = createApp(RoleModal, {
        show: false,
        title: value,
      });

      const modalContainer = document.createElement("div");
      const modalInstance = modalApp.mount(modalContainer);
      document.body.appendChild(modalContainer);

      const closeModal = () => {
        (modalInstance as any).show = false;
      };

      modalApp.provide("closeModal", closeModal);

      // @ts-ignore
      const hasPermission = userHavePermission(userStore.user, value);
      // @ts-ignore
      updateElement(el, hasPermission);

      el._roleDirective = { modalApp, modalInstance };
    };

    setupDirective();
  },
  updated(el: CustomHTMLElement, binding: DirectiveBinding) {
    if (el._roleDirective) {
      const { value } = binding;
      // @ts-ignore
      const userPermissions = userStore.user.permissions;
      // @ts-ignore
      const hasPermission = userHavePermission(userStore.user, value);
      // @ts-ignore
      updateElement(el, hasPermission);
    }
  },
  unmounted(el: CustomHTMLElement) {
    if (el._roleDirective) {
      const { modalApp } = el._roleDirective;
      modalApp.unmount();
      delete el._roleDirective;
    }
  },
};

// function checkPermission(value: string, userPermissions: any) {
//   if (value === "") return true;
//   // @ts-ignore
//   if(!userPermissions) return false;
//   const permission = userPermissions.find((p: any) => p.name === value);
//   return (
//     permission &&
//     (permission.allow_deny === true || permission.allow_deny === undefined)
//   );
// }

function updateElement(el: HTMLElement, hasPermission: boolean) {
  if (hasPermission) {
    if (!el.parentNode) {
      document.body.appendChild(el);
    }
  } else {
    el.remove();
  }
}
