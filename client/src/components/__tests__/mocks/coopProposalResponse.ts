//TODO Verify if needed. might not be needed

interface CoopProposalFields {
  proposal_status: "APPROVED" | "PENDING" | "REJECTED";
  operation: string;
  change_summary: string;
  review_notes: string | null;
  coop_public: number | null;
  requested_by: number;
  requested_datetime: string;
  reviewed_by: number | null;
  reviewed_datetime: string | null;
  coop: number | null;
}

export interface CoopProposalResponse {
  model: string;
  pk: number;
  fields: CoopProposalFields;
}
export const coopProposalResonse: CoopProposalResponse[] = [
  {
    model: "directory.coopproposal",
    pk: 1,
    fields: {
      proposal_status: "APPROVED",
      operation: "CREATE",
      change_summary:
        '{"requested_by": "chicommons", "proposal_status": "PENDING", "operation": "CREATE", "requested_datetime": "2024-03-26 03:20:05.609202+00:00"}',
      review_notes: "lgtm",
      coop_public: 1,
      requested_by: 1,
      requested_datetime: "2024-03-26T03:20:05.609Z",
      reviewed_by: 1,
      reviewed_datetime: "2024-03-26T03:25:28.222Z",
      coop: 1,
    },
  },
  {
    model: "directory.coopproposal",
    pk: 2,
    fields: {
      proposal_status: "APPROVED",
      operation: "CREATE",
      change_summary:
        '{"requested_by": "chicommons", "proposal_status": "PENDING", "operation": "CREATE", "requested_datetime": "2024-03-26 03:21:10.903438+00:00"}',
      review_notes: "lgtm",
      coop_public: 2,
      requested_by: 1,
      requested_datetime: "2024-03-26T03:21:10.903Z",
      reviewed_by: 1,
      reviewed_datetime: "2024-03-26T03:25:50.287Z",
      coop: 2,
    },
  },
  {
    model: "directory.coopproposal",
    pk: 3,
    fields: {
      proposal_status: "APPROVED",
      operation: "CREATE",
      change_summary:
        '{"requested_by": "chicommons", "proposal_status": "PENDING", "operation": "CREATE", "requested_datetime": "2024-03-26 03:22:15.700678+00:00"}',
      review_notes: "lgtm",
      coop_public: 3,
      requested_by: 1,
      requested_datetime: "2024-03-26T03:22:15.700Z",
      reviewed_by: 1,
      reviewed_datetime: "2024-03-26T03:25:52.627Z",
      coop: 3,
    },
  },
  {
    model: "directory.coopproposal",
    pk: 4,
    fields: {
      proposal_status: "APPROVED",
      operation: "CREATE",
      change_summary:
        '{"requested_by": "chicommons", "proposal_status": "PENDING", "operation": "CREATE", "requested_datetime": "2024-03-26 03:22:47.274234+00:00"}',
      review_notes: "lgtm",
      coop_public: 4,
      requested_by: 1,
      requested_datetime: "2024-03-26T03:22:47.274Z",
      reviewed_by: 1,
      reviewed_datetime: "2024-03-26T03:25:55.011Z",
      coop: 4,
    },
  },
  {
    model: "directory.coopproposal",
    pk: 5,
    fields: {
      proposal_status: "APPROVED",
      operation: "CREATE",
      change_summary:
        '{"requested_by": "chicommons", "proposal_status": "PENDING", "operation": "CREATE", "requested_datetime": "2024-03-26 03:23:08.924366+00:00"}',
      review_notes: "lgtm",
      coop_public: 5,
      requested_by: 1,
      requested_datetime: "2024-03-26T03:23:08.924Z",
      reviewed_by: 1,
      reviewed_datetime: "2024-03-26T03:25:57.540Z",
      coop: 5,
    },
  },
  {
    model: "directory.coopproposal",
    pk: 6,
    fields: {
      proposal_status: "APPROVED",
      operation: "CREATE",
      change_summary:
        '{"requested_by": "chicommons", "proposal_status": "PENDING", "operation": "CREATE", "requested_datetime": "2024-03-26 03:23:32.261459+00:00"}',
      review_notes: "lgtm",
      coop_public: 6,
      requested_by: 1,
      requested_datetime: "2024-03-26T03:23:32.261Z",
      reviewed_by: 1,
      reviewed_datetime: "2024-03-26T03:25:59.962Z",
      coop: 6,
    },
  },
  {
    model: "directory.coopproposal",
    pk: 7,
    fields: {
      proposal_status: "APPROVED",
      operation: "CREATE",
      change_summary:
        '{"requested_by": "chicommons", "proposal_status": "PENDING", "operation": "CREATE", "requested_datetime": "2024-03-26 03:23:54.307035+00:00"}',
      review_notes: "lgtm",
      coop_public: 7,
      requested_by: 1,
      requested_datetime: "2024-03-26T03:23:54.307Z",
      reviewed_by: 1,
      reviewed_datetime: "2024-03-26T03:26:02.485Z",
      coop: 7,
    },
  },
  {
    model: "directory.coopproposal",
    pk: 8,
    fields: {
      proposal_status: "APPROVED",
      operation: "CREATE",
      change_summary:
        '{"requested_by": "chicommons", "proposal_status": "PENDING", "operation": "CREATE", "requested_datetime": "2024-03-26 03:24:13.929899+00:00"}',
      review_notes: "lgtm",
      coop_public: 8,
      requested_by: 1,
      requested_datetime: "2024-03-26T03:24:13.929Z",
      reviewed_by: 1,
      reviewed_datetime: "2024-03-26T03:26:05.268Z",
      coop: 8,
    },
  },
  {
    model: "directory.coopproposal",
    pk: 9,
    fields: {
      proposal_status: "APPROVED",
      operation: "CREATE",
      change_summary:
        '{"requested_by": "chicommons", "proposal_status": "PENDING", "operation": "CREATE", "requested_datetime": "2024-03-26 03:26:59.501605+00:00"}',
      review_notes: "lgtm",
      coop_public: 9,
      requested_by: 1,
      requested_datetime: "2024-03-26T03:26:59.501Z",
      reviewed_by: 1,
      reviewed_datetime: "2024-03-26T03:27:22.776Z",
      coop: 9,
    },
  },
  {
    model: "directory.coopproposal",
    pk: 10,
    fields: {
      proposal_status: "PENDING",
      operation: "CREATE",
      change_summary:
        '{"requested_by": "chicommons", "proposal_status": "PENDING", "operation": "CREATE", "requested_datetime": "2024-03-26 03:27:15.226673+00:00"}',
      review_notes: null,
      coop_public: null,
      requested_by: 1,
      requested_datetime: "2024-03-26T03:27:15.226Z",
      reviewed_by: null,
      reviewed_datetime: null,
      coop: 10,
    },
  },
  {
    model: "directory.coopproposal",
    pk: 11,
    fields: {
      proposal_status: "APPROVED",
      operation: "DELETE",
      change_summary:
        '{"requested_by": "chicommons", "proposal_status": "PENDING", "operation": "DELETE", "requested_datetime": "2024-03-26 03:28:01.999378+00:00"}',
      review_notes: "lgtm",
      coop_public: 9,
      requested_by: 1,
      requested_datetime: "2024-03-26T03:28:01.999Z",
      reviewed_by: 1,
      reviewed_datetime: "2024-03-26T03:28:27.533Z",
      coop: null,
    },
  },
];
