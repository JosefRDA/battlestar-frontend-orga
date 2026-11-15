"use client";

import { AreaChartIcon as ChartArea, Server, Bug, Wrench, Users, HeartPulse, Stethoscope, Activity, HardDrive, Settings } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MainStats from "./stats/global";
import AdminTestPanel from "./admin-test";
import HackingsTestPanel from "./hackings-test";
import IncidentsTestPanel from "./incidents-test";
import PartsTestPanel from "./parts-test";
import PeopleTestPanel from "./people-test";
import PeopleHealthsTestPanel from "./people-healths-test";
import PeopleHealthSymptomsTestPanel from "./people-health-symptoms-test";
import ReparationsTestPanel from "./reparations-test";
import SystemHealthsTestPanel from "./system-healths-test";
import SystemsTestPanel from "./systems-test";
import UsersTestPanel from "./users-test";

export default function Content() {
  return (
    <div className="space-y-4">
      <div className="bg-zinc-300 dark:bg-[#0F0F12] rounded-xl p-6 flex flex-col items-start justify-start border border-gray-200 dark:border-[#1F1F23]">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-left flex items-center gap-2">
          <ChartArea className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-50" />
          Statistics
        </h2>
        <MainStats />
      </div>

      <Tabs defaultValue="admin" className="space-y-4">
        <TabsList className="grid w-full grid-cols-11">
          <TabsTrigger value="admin"><Settings className="mr-2 h-4 w-4" />Admin</TabsTrigger>
          <TabsTrigger value="hackings"><Bug className="mr-2 h-4 w-4" />Hackings</TabsTrigger>
          <TabsTrigger value="incidents"><Activity className="mr-2 h-4 w-4" />Incidents</TabsTrigger>
          <TabsTrigger value="parts"><HardDrive className="mr-2 h-4 w-4" />Parts</TabsTrigger>
          <TabsTrigger value="reparations"><Wrench className="mr-2 h-4 w-4" />Reparations</TabsTrigger>
          <TabsTrigger value="systems"><Server className="mr-2 h-4 w-4" />Systems</TabsTrigger>
          <TabsTrigger value="system-healths"><HeartPulse className="mr-2 h-4 w-4" />System Healths</TabsTrigger>
          <TabsTrigger value="people"><Users className="mr-2 h-4 w-4" />People</TabsTrigger>
          <TabsTrigger value="people-healths"><Stethoscope className="mr-2 h-4 w-4" />People Healths</TabsTrigger>
          <TabsTrigger value="people-health-symptoms"><HeartPulse className="mr-2 h-4 w-4" />Symptoms</TabsTrigger>
          <TabsTrigger value="users"><Users className="mr-2 h-4 w-4" />Users</TabsTrigger>
        </TabsList>

        <TabsContent value="admin">
          <AdminTestPanel />
        </TabsContent>

        <TabsContent value="hackings">
          <HackingsTestPanel />
        </TabsContent>

        <TabsContent value="incidents">
          <IncidentsTestPanel />
        </TabsContent>

        <TabsContent value="parts">
          <PartsTestPanel />
        </TabsContent>

        <TabsContent value="reparations">
          <ReparationsTestPanel />
        </TabsContent>

        <TabsContent value="systems">
          <SystemsTestPanel />
        </TabsContent>

        <TabsContent value="system-healths">
          <SystemHealthsTestPanel />
        </TabsContent>

        <TabsContent value="people">
          <PeopleTestPanel />
        </TabsContent>

        <TabsContent value="people-healths">
          <PeopleHealthsTestPanel />
        </TabsContent>

        <TabsContent value="people-health-symptoms">
          <PeopleHealthSymptomsTestPanel />
        </TabsContent>

        <TabsContent value="users">
          <UsersTestPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}