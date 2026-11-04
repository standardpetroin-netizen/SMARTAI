/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SmartAISocietyProvider, useSmartAISociety } from './context/SmartAISocietyContext';
import { Navbar } from './components/Navbar';
import { SubAppNavHeader } from './components/SubAppNavHeader';
import { Hero } from './components/Hero';
import { InteractiveAppsSection } from './components/InteractiveAppsSection';
import { MobileAppBannerSection } from './components/MobileAppBannerSection';
import { SocietyPhotoShowcase } from './components/SocietyPhotoShowcase';
import { FeatureDemos } from './components/FeatureDemos';
import { WhiteLabelShowcase } from './components/WhiteLabelShowcase';
import { CaseStudies } from './components/CaseStudies';
import { PricingCalculator } from './components/PricingCalculator';
import { Footer } from './components/Footer';
import { ResidentDashboard } from './components/ResidentDashboard';
import { GuardGateTerminal } from './components/GuardGateTerminal';
import { WaterOpsMonitor } from './components/WaterOpsMonitor';
import { SuperAdminConsole } from './components/SuperAdminConsole';
import { SocietyPanel } from './components/SocietyPanel';
import { FlutterAppStudio } from './components/FlutterAppStudio';
import { ProvisioningModal } from './components/ProvisioningWorkflow/ProvisioningModal';
import { DemoRequestModal } from './components/DemoRequestModal';
import { PrioritySubscriptionModal } from './components/PrioritySubscriptionModal';
import { SubscriptionRequiredGate } from './components/SubscriptionRequiredGate';
import { GlobalToast } from './components/GlobalToast';
import { AnimatedFlyingDrones } from './components/AnimatedFlyingDrones';

function MainAppShell() {
  const { 
    activeView, 
    isSubscribed, 
    isSubscriptionModalOpen, 
    closeSubscriptionModal, 
    subscriptionTargetFeature, 
    openSubscriptionModal 
  } = useSmartAISociety();

  const [isProvisioningOpen, setIsProvisioningOpen] = useState<boolean>(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState<boolean>(false);
  const [isPrioritySubscriptionOpen, setIsPrioritySubscriptionOpen] = useState<boolean>(false);
  const [provisioningInitialFlats, setProvisioningInitialFlats] = useState<number>(250);
  const [provisioningInitialWhiteLabel, setProvisioningInitialWhiteLabel] = useState<boolean>(true);

  const handleStartProvisioningWithConfig = (flats: number, isWhiteLabel: boolean) => {
    setProvisioningInitialFlats(flats);
    setProvisioningInitialWhiteLabel(isWhiteLabel);
    setIsProvisioningOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white antialiased flex flex-col">
      {/* 4 to 5 Continuous Animated Flying Drones across the Homepage */}
      {activeView === 'marketing' && <AnimatedFlyingDrones />}

      {/* 1. Main Navigation Header (Top viewport bar removed per user request) */}
      {activeView === 'marketing' ? (
        <>
          <Navbar
            onOpenProvisioning={() => setIsProvisioningOpen(true)}
            onOpenLeadModal={() => setIsLeadModalOpen(true)}
            isProvisioningOpen={isProvisioningOpen}
          />

          <main className="flex-1 bg-white">
            {/* 1. Hero with Society High-Rise Architectural Picture & Perspective Switcher */}
            <Hero
              onOpenProvisioning={() => setIsProvisioningOpen(true)}
              onOpenLeadModal={() => setIsLeadModalOpen(true)}
            />

            {/* 2. Four Connected Live Society Apps Showcase (Resident, Gate, Water IoT, Super-Admin) */}
            <InteractiveAppsSection />

            {/* 3. Mobile App Download & Install Section */}
            <MobileAppBannerSection
              onOpenPrioritySubscription={() => setIsPrioritySubscriptionOpen(true)}
            />

            {/* 4. Society Life & Visual Infrastructure Gallery (8 Facility Photos) */}
            <div id="showcase">
              <SocietyPhotoShowcase />
            </div>

            {/* 5. Ground Operational Features & Live Simulators */}
            <FeatureDemos />

            {/* 5. Enterprise White-Labeling Engine */}
            <WhiteLabelShowcase />

            {/* 6. Case Studies & Proven Impact */}
            <CaseStudies />

            {/* 7. Interactive Pricing & Priority Subscription Calculator */}
            <PricingCalculator
              onStartProvisioningWithConfig={handleStartProvisioningWithConfig}
              onOpenPriorityCheckout={() => setIsPrioritySubscriptionOpen(true)}
            />
          </main>

          <Footer
            onOpenProvisioning={() => setIsProvisioningOpen(true)}
            onOpenLeadModal={() => setIsLeadModalOpen(true)}
          />
        </>
      ) : (
        <>
          {/* Dedicated Sub-App Navigation Header with '← Back to Home' and Module Switcher */}
          <SubAppNavHeader />

          {!isSubscribed ? (
            <main className="flex-1 py-8 bg-slate-50 flex items-center justify-center">
              <SubscriptionRequiredGate
                featureName={
                  activeView === 'resident'
                    ? 'Resident Mobile App'
                    : activeView === 'society_panel'
                    ? 'Society Admin Panel & Drone Command'
                    : activeView === 'guard'
                    ? 'Smart Gate Security Terminal'
                    : activeView === 'water'
                    ? 'Automated IoT Water Ops'
                    : activeView === 'provisioning'
                    ? 'Site Admin Master Console'
                    : 'smartaisociety Module'
                }
                onOpenSubscriptionModal={() =>
                  openSubscriptionModal(
                    activeView === 'resident'
                      ? 'Resident Mobile App'
                      : activeView === 'society_panel'
                      ? 'Society Admin Panel & Drone Command'
                      : activeView === 'guard'
                      ? 'Smart Gate Security Terminal'
                      : activeView === 'water'
                      ? 'Automated IoT Water Ops'
                      : 'Township Module',
                    activeView
                  )
                }
              />
            </main>
          ) : (
            <>
              {activeView === 'resident' && (
                <main className="flex-1 py-8 bg-slate-50">
                  <ResidentDashboard />
                </main>
              )}

              {activeView === 'society_panel' && (
                <main className="flex-1 py-8 bg-slate-50">
                  <SocietyPanel />
                </main>
              )}

              {activeView === 'guard' && (
                <main className="flex-1 py-8 bg-slate-50">
                  <GuardGateTerminal />
                </main>
              )}

              {activeView === 'water' && (
                <main className="flex-1 py-8 bg-slate-50">
                  <WaterOpsMonitor />
                </main>
              )}

              {activeView === 'provisioning' && (
                <main className="flex-1 py-8 bg-slate-50">
                  <SuperAdminConsole
                    onOpenProvisioningWizard={() => setIsProvisioningOpen(true)}
                  />
                </main>
              )}

              {activeView === 'flutter_app' && (
                <main className="flex-1 py-8 bg-slate-50">
                  <FlutterAppStudio />
                </main>
              )}
            </>
          )}
        </>
      )}

      {/* Global Super-Admin Society Provisioning Workflow Modal */}
      <ProvisioningModal
        isOpen={isProvisioningOpen}
        onClose={() => setIsProvisioningOpen(false)}
        initialFlats={provisioningInitialFlats}
        initialIsWhiteLabel={provisioningInitialWhiteLabel}
      />

      {/* Lead Capture & Trial Activation Modal */}
      <DemoRequestModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onLaunchProvisioning={() => setIsProvisioningOpen(true)}
      />

      {/* Priority Subscription & Payment Modal for Mobile App & Features */}
      <PrioritySubscriptionModal
        isOpen={isSubscriptionModalOpen || isPrioritySubscriptionOpen}
        onClose={() => {
          closeSubscriptionModal();
          setIsPrioritySubscriptionOpen(false);
        }}
        initialFlats={provisioningInitialFlats}
      />

      {/* Cross-App Real-time Event Toast */}
      <GlobalToast />
    </div>
  );
}

export default function App() {
  return (
    <SmartAISocietyProvider>
      <MainAppShell />
    </SmartAISocietyProvider>
  );
}
