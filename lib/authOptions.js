import bcrypt from "bcrypt";
import connectDB from "./db";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";

export const authOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    await connectDB(); // Ensure database connection is established
                    const user = await User.findOne({ email: credentials.email?.toLowerCase() });

                    if (!user) {
                        throw new Error('User not found');
                    }

                    if (!user.password) {
                        throw new Error('User password is not set');
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if (!isPasswordCorrect) {
                        throw new Error('Password did not match');
                    }

                    return user;
                } catch (error) {
                    console.error('Error during authentication:', error);
                    throw error;
                }
            }
        }),
    ],
    session: {
        strategy: 'jwt',
        secret: process.env.NEXTAUTH_SECRET,
    },
    secret: process.env.NEXTAUTH_SECRET,

    pages: {
        signIn: '/admin',
        signOut: '/shop',
    },

    callbacks: {
        async session({ session, token }) {
            session.user = {
                ...session.user,
                id: token.id,
                accessToken: token.accessToken,
                firstName: token.firstName,
                lastName: token.lastName,
                role: token.role,
                username: token.username,
                email: token.email,
                contactNumber: token.contactNumber,
                isEmailVerified: token.isEmailVerified,
                isContactVerified: token.isContactVerified,
                status: token.status,
                createdAt: token.createdAt,
                updatedAt: token.updatedAt,
                customUserId: token.customUserId,
                uniqueID: token.uniqueID,
                capabilities: token.capabilities,
                newVal: token.newVal, // Use the updated token property
            };
            return session;
        },
        async jwt({ token, user, trigger, session, account }) {

            if (user) {
                token.id = user.id;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.role = user.role;
                token.username = user.username;
                token.email = user.email;
                token.contactNumber = user.contactNumber;
                token.isEmailVerified = user.isEmailVerified;
                token.isContactVerified = user.isContactVerified;
                token.status = user.status;
                token.createdAt = user.createdAt;
                token.updatedAt = user.updatedAt;
                token.customUserId = user.customUserId;
                token.uniqueID = user.uniqueID;
                token.capabilities = user.capabilities;
            }

            // Update token properties based on some conditions or trigger
            if (trigger === "update" && session) {
                token = {
                    ...token,
                    ...session?.user
                }; // Update the token with newVal from the session
            }
            return token;
        },
        // async redirect({ url, baseUrl, account, profile }) {
        //     // Check if the user is an admin or a regular user
        //     console.log("account ===", url, baseUrl, account, profile );
            
        //     const role = profile?.role || 'user';  // Assuming profile includes user roles
        //     if (role === 'admin') {
        //         return '/admin'; // Redirect admin users to the admin dashboard
        //     }
        // }
    },
};
