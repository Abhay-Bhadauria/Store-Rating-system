import toast from 'react-hot-toast';

export const toastUtils = {
  success: (message) => {
    return toast.success(message);
  },

  error: (message) => {
    return toast.error(message);
  },

  info: (message) => {
    return toast(message);
  },

  warning: (message) => {
    return toast(message, {
      icon: '⚠️',
    });
  },

  loading: (message) => {
    return toast.loading(message);
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  promise: (promise, { loading, success, error }) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    });
  },
};

export default toastUtils;
