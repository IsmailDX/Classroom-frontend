import type { AuthProvider } from "@refinedev/core";
import { User, SignUpPayload } from "@/types";
import { authClient } from "@/lib/auth-client";

export const authProvider: AuthProvider = {
  register: async (params: any) => {
    const { email, password, name, role, image, imageCldPubId, providerName } =
      params ?? {};

    try {
      // Social sign up / sign in with provider (e.g. Google, GitHub)
      if (providerName) {
        await authClient.signIn.social({
          provider: providerName,
          callbackURL: '/',
        });

        // In practice, the above call will redirect away from the SPA.
        // We still return a success shape for Refine.
        return {
          success: true,
        };
      }

      // Email + password registration
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        image,
        role,
        imageCldPubId,
      } as SignUpPayload);

      if (error) {
        return {
          success: false,
          error: {
            name: 'Registration failed',
            message:
              error?.message || 'Unable to create account. Please try again.',
          },
        };
      }

      // Store user data
      localStorage.setItem('user', JSON.stringify(data.user));

      return {
        success: true,
        redirectTo: '/',
      };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: {
          name: 'Registration failed',
          message: 'Unable to create account. Please try again.',
        },
      };
    }
  },
  login: async (params: any) => {
    const { email, password, providerName } = params ?? {};

    try {
      // Social login (e.g. Google, GitHub)
      if (providerName) {
        await authClient.signIn.social({
          provider: providerName,
          callbackURL: '/',
        });

        return {
          success: true,
        };
      }

      // Email + password login
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        console.error('Login error from auth client:', error);
        return {
          success: false,
          error: {
            name: 'Login failed',
            message: error?.message || 'Please try again later.',
          },
        };
      }

      // Store user data
      localStorage.setItem('user', JSON.stringify(data.user));

      return {
        success: true,
        redirectTo: '/',
      };
    } catch (error) {
      console.error('Login exception:', error);
      return {
        success: false,
        error: {
          name: 'Login failed',
          message: 'Please try again later.',
        },
      };
    }
  },
  logout: async () => {
    const { error } = await authClient.signOut();

    if (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        error: {
          name: "Logout failed",
          message: "Unable to log out. Please try again.",
        },
      };
    }

    localStorage.removeItem("user");

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
  check: async () => {
    const user = localStorage.getItem("user");

    if (user) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
      error: {
        name: "Unauthorized",
        message: "Check failed",
      },
    };
  },
  getPermissions: async () => {
    const user = localStorage.getItem("user");

    if (!user) return null;
    const parsedUser: User = JSON.parse(user);

    return {
      role: parsedUser.role,
    };
  },
  getIdentity: async () => {
    const user = localStorage.getItem("user");

    if (!user) return null;
    const parsedUser: User = JSON.parse(user);

    return {
      id: parsedUser.id,
      name: parsedUser.name,
      email: parsedUser.email,
      image: parsedUser.image,
      role: parsedUser.role,
      imageCldPubId: parsedUser.imageCldPubId,
    };
  },
};
