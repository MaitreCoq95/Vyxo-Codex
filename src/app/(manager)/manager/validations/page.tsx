'use client';

import * as React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  Select,
  TextArea,
  useToast,
} from '@/components/ui';

/* ==========================================
 * MANAGER VALIDATIONS PAGE
 * Skill validation workflow
 * ========================================== */

export default function ManagerValidationsPage() {
  const user = {
    name: 'Sarah Mills',
    email: 'sarah.mills@company.com',
    notificationCount: 5,
  };

  const { success, error } = useToast();

  const [selectedValidation, setSelectedValidation] = React.useState<number | null>(null);
  const [validityPeriod, setValidityPeriod] = React.useState('2');
  const [notes, setNotes] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const pendingValidations = [
    {
      id: 1,
      userName: 'John Doe',
      userEmail: 'john.doe@company.com',
      skillName: 'Forklift Operation - Level 2',
      submittedDate: '2 days ago',
      evidence: [
        { type: 'pdf', name: 'Certificate.pdf', url: '#' },
        { type: 'image', name: 'Practical_Demo.jpg', url: '#' },
      ],
      checklist: [
        { item: 'Pre-operation inspection knowledge', checked: true },
        { item: 'Load handling demonstrated', checked: true },
        { item: 'Safety protocols followed', checked: true },
      ],
    },
    {
      id: 2,
      userName: 'Jane Smith',
      userEmail: 'jane.smith@company.com',
      skillName: 'Hazmat Handling - Basic',
      submittedDate: '1 day ago',
      evidence: [
        { type: 'pdf', name: 'Training_Certificate.pdf', url: '#' },
      ],
      checklist: [
        { item: 'Classification knowledge', checked: true },
        { item: 'PPE usage demonstrated', checked: true },
        { item: 'Emergency procedures', checked: false },
      ],
    },
    {
      id: 3,
      userName: 'Mike Chen',
      userEmail: 'mike.chen@company.com',
      skillName: 'Loading Dock Safety',
      submittedDate: '3 hours ago',
      evidence: [
        { type: 'video', name: 'Safety_Demonstration.mp4', url: '#' },
      ],
      checklist: [
        { item: 'Traffic management', checked: true },
        { item: 'Equipment checks', checked: true },
        { item: 'Communication protocols', checked: true },
      ],
    },
  ];

  const handleValidate = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setSelectedValidation(null);
    success('Skill validated successfully');
  };

  const handleReject = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setSelectedValidation(null);
    error('Validation rejected. User will be notified.');
  };

  const currentValidation = pendingValidations.find((v) => v.id === selectedValidation);
  const allChecked = currentValidation?.checklist.every((c) => c.checked) || false;

  return (
    <DashboardShell role="manager" user={user}>
      <PageHeader
        title="Skill Validations"
        description="Review and approve skill validation requests"
        breadcrumbs={[
          { label: 'Manager', href: '/manager/overview' },
          { label: 'Validations' },
        ]}
      />

      <div className="space-y-6 p-4 mobile:p-6">
        {/* Pending count */}
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-text-primary">
            Pending Validations
          </h2>
          <Badge variant="warning" size="sm">
            {pendingValidations.length} pending
          </Badge>
        </div>

        {/* Validation requests */}
        <div className="space-y-4">
          {pendingValidations.map((validation) => (
            <Card key={validation.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle>{validation.skillName}</CardTitle>
                    <div className="mt-2 space-y-1 text-sm text-text-secondary">
                      <p>Submitted by: {validation.userName}</p>
                      <p>Email: {validation.userEmail}</p>
                      <p>Submitted: {validation.submittedDate}</p>
                    </div>
                  </div>
                  <Badge variant="warning" size="sm">
                    Pending
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Evidence */}
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-text-primary">Evidence</h4>
                  <div className="space-y-2">
                    {validation.evidence.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-md border border-border-subtle bg-background-tertiary p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-primary/10 text-accent-primary">
                            {file.type === 'pdf' && (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            )}
                            {file.type === 'image' && (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            )}
                            {file.type === 'video' && (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm font-medium text-text-primary">{file.name}</span>
                        </div>
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checklist */}
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-text-primary">Validation Checklist</h4>
                  <div className="space-y-2">
                    {validation.checklist.map((check, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        {check.checked ? (
                          <svg className="h-5 w-5 text-status-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        <span className={check.checked ? 'text-text-primary' : 'text-text-tertiary'}>
                          {check.item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="gap-3">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => {
                    setSelectedValidation(validation.id);
                    setNotes('');
                  }}
                >
                  Reject
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => setSelectedValidation(validation.id)}
                >
                  Validate Skill
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {pendingValidations.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background-tertiary">
                <svg className="h-8 w-8 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-text-primary">All caught up!</h3>
              <p className="text-sm text-text-secondary">
                No pending skill validations at this time
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Validation Modal */}
      {currentValidation && (
        <Modal
          open={selectedValidation !== null}
          onClose={() => setSelectedValidation(null)}
          size="md"
        >
          <ModalHeader onClose={() => setSelectedValidation(null)}>
            <ModalTitle>Validate Skill</ModalTitle>
          </ModalHeader>

          <ModalBody className="space-y-4">
            <div>
              <p className="text-sm text-text-secondary">You are about to validate:</p>
              <p className="mt-1 font-semibold text-text-primary">{currentValidation.skillName}</p>
              <p className="text-sm text-text-secondary">For: {currentValidation.userName}</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Validity Period
              </label>
              <Select
                value={validityPeriod}
                onChange={(e) => setValidityPeriod(e.target.value)}
              >
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3 years</option>
                <option value="5">5 years</option>
                <option value="permanent">Permanent</option>
              </Select>
              <p className="mt-1 text-xs text-text-secondary">
                {validityPeriod === 'permanent'
                  ? 'This skill will never expire'
                  : `Expires: ${new Date(new Date().setFullYear(new Date().getFullYear() + parseInt(validityPeriod))).toLocaleDateString()}`}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Notes (optional)
              </label>
              <TextArea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any comments or observations..."
                rows={3}
              />
            </div>

            {!allChecked && (
              <div className="rounded-md border border-status-warning bg-status-warning-bg p-3">
                <p className="text-sm text-text-primary">
                  ⚠️ Not all checklist items are marked as complete
                </p>
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="secondary" onClick={() => setSelectedValidation(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleValidate} isLoading={isLoading}>
              Confirm Validation
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </DashboardShell>
  );
}
