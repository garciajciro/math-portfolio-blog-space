
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLoginForm from './AdminLoginForm';
import AdminSignupForm from './AdminSignupForm';

interface AdminLoginCardProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const AdminLoginCard = ({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  isLoading,
  setIsLoading
}: AdminLoginCardProps) => {
  return (
    <Card className="w-full max-w-md shadow-lg border-portfolio-orange/20 bg-portfolio-dark/90 backdrop-blur-sm text-portfolio-light">
      <CardHeader className="bg-gradient-to-br from-portfolio-orange/20 to-portfolio-accent/10 rounded-t-lg p-6">
        <CardTitle className="text-2xl text-portfolio-orange">Admin Portal</CardTitle>
        <CardDescription className="text-portfolio-light/70">
          Sign in or register to access the admin dashboard
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 bg-portfolio-dark/60">
            <TabsTrigger 
              value="login" 
              className="data-[state=active]:bg-portfolio-orange data-[state=active]:text-portfolio-dark"
            >
              Login
            </TabsTrigger>
            {/* <TabsTrigger 
              value="signup" 
              className="data-[state=active]:bg-portfolio-orange data-[state=active]:text-portfolio-dark"
            >
              Register
            </TabsTrigger> */}
          </TabsList>
          
          <TabsContent value="login">
            <AdminLoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </TabsContent>
          
          <TabsContent value="signup">
            <AdminSignupForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminLoginCard;
