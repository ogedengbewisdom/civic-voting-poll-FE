enum StatuEnum {
  DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed',
}

export interface IPollOptions {
  id: number;
  option_text: string;
  poll_id: number;
  vote_count?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: any;
}

export interface IPoll {
  id: number;
  title: string;
  description: string;
  status: StatuEnum;
  poll_option: IPollOptions[];
  created_at: string;
  updated_at: string;
}

export interface IDashboard {
  active_polls: number;
  total_votes: number;
  states_reached: number;
}

export interface IResponse<T> {
  statusCode: number;
  status: string;
  data: T;
  timestamp: string;
  message: string;
}

export interface IPagination {
  total: number;
  total_pages: number;
  page: number;
  limit: number;
  has_next_page: boolean;
  has_previous_page: boolean;
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: IPagination;
}

export interface IDetailProps {
  id: number;
  title: string;
  description: string;
  status: string;
  user: {
    first_name: string;
    last_name: string;
  };
  created_at: string;
  updated_at: string;
  total_vote: number;
  poll_option: IPollOptions[];
}

export interface IVote {
  id: number;
  user_id: number;
  poll_id: number;
  option_id: number;
  state: { name: string };
}
interface IResultPollOption {
  option_id: number;
  option_text: string;
  total_votes: number;
  percentage: number | null;
  by_state: any[];
}

interface IStateProps {
  state_id: number;
  state_name: string;
  count: number;
}
export interface IVoteResult {
  poll_id: number;
  title: string;
  description: string;
  status: string;
  summary: {
    total_votes: number;
    leading_option: string;
    states_voting: number;
  };
  poll_option: IResultPollOption[];
  all_states: IStateProps[];
}

export interface IPolls {
  id: number;
  title: string;
  description: string;
  status: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
  poll_option_count: number;
}
