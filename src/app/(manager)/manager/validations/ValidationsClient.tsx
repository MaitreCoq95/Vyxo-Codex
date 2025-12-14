'use client';

import * as React from 'react';
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

interface Validation {
  id: string;
  user_id: string;
  module_id: string;
  type: string;
  file_url: string | null;
  metadata: any;
  validation_status: string;
  created_at: string;
  user: {
    full_name: string;
    email: string;
  };
  module: {
    title: string;
  };
}

interface ValidationsClientProps {
  validations: Validation[];
}

export function ValidationsClient({ validations }: ValidationsClientProps) {
  const { success, error } = useToast();
  const [selectedValidation, setSelectedValidation] = React.useState<string | null>(null);
  const [validityPeriod, setValidityPeriod] = React.useState('2');
  const [notes, setNotes] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleValidate = async () => {
    if (!selectedValidation) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/validations/${selectedValidation}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          validity_years: parseInt(validityPeriod),
          notes,
        }),
      });

      if (!response.ok) throw new Error('Failed to validate');

      success('Skill validated successfully');
      setSelectedValidation(null);
      setNotes('');

      // Refresh the page to show updated data
      window.location.reload();
    } catch (err) {
      error('Failed to validate skill. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedValidation) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/validations/${selectedValidation}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) throw new Error('Failed to reject');

      error('Validation rejected. User will be notified.');
      setSelectedValidation(null);
      setNotes('');

      // Refresh the page
      window.location.reload();
    } catch (err) {
      error('Failed to reject validation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentValidation = validations.find((v) => v.id === selectedValidation);
  const evidenceFiles = currentValidation?.metadata?.evidence || [];
  const checklist = currentValidation?.metadata?.checklist || [];
  const allChecked = checklist.every((c: any) => c.checked);

  function getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  return (
    <>
      <div className="space-y-6 p-4 mobile:p-6">
        {/* Pending count */}
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-text-primary">Pending Validations</h2>
          <Badge variant="warning" size="sm">
            {validations.length} pending
          </Badge>
        </div>

        {/* Validation requests */}
        <div className="space-y-4">
          {validations.map((validation) => (
            <Card key={validation.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle>{validation.module.title}</CardTitle>
                    <div className="mt-2 space-y-1 text-sm text-text-secondary">
                      <p>Submitted by: {validation.user.full_name}</p>
                      <p>Email: {validation.user.email}</p>
                      <p>Submitted: {getRelativeTime(validation.created_at)}</p>
                    </div>
                  </div>
                  <Badge variant="warning" size="sm">
                    Pending
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Evidence files */}
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-text-primary">Evidence Submitted</h4>
                  <div className="space-y-2">
                    {evidenceFiles.length > 0 ? (
                      evidenceFiles.map((file: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-md border border-border-subtle bg-background-tertiary p-3"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-text-primary">{file.name}</span>
                            <Badge variant="neutral" size="sm">
                              {file.type}
                            </Badge>
                          </div>
                          {validation.file_url && (
                            <a href={validation.file_url} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="ghost">
                                View
                              </Button>
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-text-secondary">No files submitted</p>
                    )}
                  </div>
                </div>

                {/* Validation checklist */}
                {checklist.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-text-primary">Validation Criteria</h4>
                    <div className="space-y-2">
                      {checklist.map((check: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          {check.checked ? (
                            <svg
                              className="h-5 w-5 text-status-success"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-5 w-5 text-status-error"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          )}
                          <span className="text-text-primary">{check.item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button variant="secondary" onClick={() => handleReject()}>
                  Reject
                </Button>
                <Button variant="primary" onClick={() => setSelectedValidation(validation.id)}>
                  Validate Skill
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {validations.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background-tertiary">
                <svg
                  className="h-8 w-8 text-text-tertiary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-text-primary">No pending validations</h3>
              <p className="text-sm text-text-secondary">
                All skill validation requests have been processed
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Validation Modal */}
      <Modal open={selectedValidation !== null} onOpenChange={() => setSelectedValidation(null)}>
        <ModalHeader>
          <ModalTitle>Validate Skill</ModalTitle>
        </ModalHeader>
        <ModalBody className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-text-primary">
              You are about to validate:
            </p>
            <p className="text-sm font-semibold text-text-primary">
              {currentValidation?.module.title}
            </p>
            <p className="text-sm text-text-secondary">for {currentValidation?.user.full_name}</p>
          </div>

          {!allChecked && (
            <div className="rounded-md border border-status-warning bg-status-warning/10 p-3">
              <p className="text-sm text-status-warning">
                ⚠️ Warning: Not all validation criteria are checked
              </p>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Validity Period
            </label>
            <Select value={validityPeriod} onChange={(e) => setValidityPeriod(e.target.value)}>
              <option value="1">1 year</option>
              <option value="2">2 years</option>
              <option value="3">3 years</option>
              <option value="5">5 years</option>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Validation Notes (optional)
            </label>
            <TextArea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this validation..."
              rows={4}
            />
          </div>
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
    </>
  );
}
