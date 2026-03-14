
import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

const AdminSettings: React.FC = () => {
  return (
    <AdminLayout title="Settings">
      <div className="space-y-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="profile" className="border-b-0">
            <AccordionTrigger className="py-4 px-5 bg-[#3E3D32] rounded-t-lg hover:no-underline">
              <h3 className="text-xl font-semibold">Profile Settings</h3>
            </AccordionTrigger>
            <AccordionContent className="bg-[#3E3D32] px-5 pb-5 rounded-b-lg border-t border-[#4e4d40]">
              <p className="text-portfolio-comment mb-4">
                Configure your profile information and account settings.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Display Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md bg-background"
                    placeholder="Your display name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded-md bg-background"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea
                    className="w-full p-2 border rounded-md bg-background"
                    rows={3}
                    placeholder="A short bio about yourself"
                  ></textarea>
                </div>
                <div className="flex justify-end pt-2">
                  <Button className="flex items-center gap-1">
                    <Save size={14} />
                    Save Profile
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="site" className="border-b-0">
            <AccordionTrigger className="py-4 px-5 bg-[#3E3D32] rounded-t-lg hover:no-underline">
              <h3 className="text-xl font-semibold">Site Configuration</h3>
            </AccordionTrigger>
            <AccordionContent className="bg-[#3E3D32] px-5 pb-5 rounded-b-lg border-t border-[#4e4d40]">
              <p className="text-portfolio-comment mb-4">
                Manage your site's appearance, SEO settings, and other global configurations.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Site Title</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md bg-background"
                    placeholder="My Portfolio Website"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Meta Description</label>
                  <textarea
                    className="w-full p-2 border rounded-md bg-background"
                    rows={2}
                    placeholder="A brief description of your site for search engines"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Default Social Image URL</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md bg-background"
                    placeholder="https://example.com/social-image.jpg"
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button className="flex items-center gap-1">
                    <Save size={14} />
                    Save Configuration
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="security" className="border-b-0">
            <AccordionTrigger className="py-4 px-5 bg-[#3E3D32] rounded-t-lg hover:no-underline">
              <h3 className="text-xl font-semibold">Security Settings</h3>
            </AccordionTrigger>
            <AccordionContent className="bg-[#3E3D32] px-5 pb-5 rounded-b-lg border-t border-[#4e4d40]">
              <p className="text-portfolio-comment mb-4">
                Manage your password and security preferences.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Current Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border rounded-md bg-background"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border rounded-md bg-background"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border rounded-md bg-background"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button className="flex items-center gap-1">
                    <Save size={14} />
                    Update Password
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
