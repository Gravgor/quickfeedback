'use client';

import React from 'react';
import { Metadata } from 'next';
import SubscriptionStatus from '@/components/SubscriptionStatus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account and subscription</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Manage your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Email</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              
              <div className="pt-4">
                <Link href="/dashboard/settings/profile" passHref>
                  <Button variant="outline">Edit Profile</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Status */}
        <SubscriptionStatus />
      </div>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Manage your API keys for programmatic access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            API keys allow you to integrate QuickFeedback into your own systems and workflows.
          </p>
          <Link href="/dashboard/settings/api-keys" passHref>
            <Button variant="outline">Manage API Keys</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>
            Configure how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Control email notifications for new feedback and other important events.
          </p>
          <Link href="/dashboard/settings/notifications" passHref>
            <Button variant="outline">Manage Notifications</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
} 