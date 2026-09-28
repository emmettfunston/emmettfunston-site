/**
 * Database types for the Supabase schema.
 *
 * Hand-maintained in the same shape `supabase gen types typescript` produces.
 * If you later authenticate the Supabase CLI, you can regenerate this file:
 *
 *   npx supabase gen types typescript --project-id <project-ref> --schema public \
 *     > lib/supabase/database.types.ts
 *
 * Keep this in sync with supabase/migrations/*.sql.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type BookCategory = "math" | "grammar" | "reading";
export type RecommendationLevel =
  | "highly_recommended"
  | "recommended"
  | "optional";
export type StudyPlanStatus = "draft" | "active" | "completed" | "archived";
export type AssignmentType =
  | "chapter"
  | "practice_test"
  | "review"
  | "mistake_review";
export type MistakeSourceType = "practice_test" | "book";
export type MistakeSection = "math" | "reading_writing";
export type WebhookProcessingStatus =
  | "received"
  | "processed"
  | "skipped"
  | "failed";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          timezone: string;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          timezone?: string;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          timezone?: string;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          stripe_product_id: string | null;
          stripe_price_id: string | null;
          amount_cents: number;
          currency: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string;
          stripe_product_id?: string | null;
          stripe_price_id?: string | null;
          amount_cents: number;
          currency?: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string;
          stripe_product_id?: string | null;
          stripe_price_id?: string | null;
          amount_cents?: number;
          currency?: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      purchases: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          stripe_checkout_session_id: string | null;
          stripe_customer_id: string | null;
          stripe_payment_intent_id: string | null;
          customer_email: string | null;
          amount_total: number | null;
          currency: string | null;
          payment_status: string;
          access_granted: boolean;
          purchased_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          stripe_checkout_session_id?: string | null;
          stripe_customer_id?: string | null;
          stripe_payment_intent_id?: string | null;
          customer_email?: string | null;
          amount_total?: number | null;
          currency?: string | null;
          payment_status?: string;
          access_granted?: boolean;
          purchased_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          stripe_checkout_session_id?: string | null;
          stripe_customer_id?: string | null;
          stripe_payment_intent_id?: string | null;
          customer_email?: string | null;
          amount_total?: number | null;
          currency?: string | null;
          payment_status?: string;
          access_granted?: boolean;
          purchased_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      books: {
        Row: {
          id: string;
          slug: string;
          title: string;
          category: BookCategory;
          description: string;
          affiliate_url: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          category: BookCategory;
          description?: string;
          affiliate_url?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          category?: BookCategory;
          description?: string;
          affiliate_url?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      book_chapters: {
        Row: {
          id: string;
          book_id: string;
          chapter_number: number;
          title: string;
          estimated_minutes: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          book_id: string;
          chapter_number: number;
          title: string;
          estimated_minutes?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          book_id?: string;
          chapter_number?: number;
          title?: string;
          estimated_minutes?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      student_settings: {
        Row: {
          id: string;
          user_id: string;
          current_math_score: number;
          current_rw_score: number;
          target_total_score: number;
          test_date: string;
          plan_start_date: string;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          current_math_score: number;
          current_rw_score: number;
          target_total_score: number;
          test_date: string;
          plan_start_date: string;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          current_math_score?: number;
          current_rw_score?: number;
          target_total_score?: number;
          test_date?: string;
          plan_start_date?: string;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      weekly_availability: {
        Row: {
          id: string;
          user_id: string;
          weekday: number;
          available: boolean;
          study_hours: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          weekday: number;
          available?: boolean;
          study_hours?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          weekday?: number;
          available?: boolean;
          study_hours?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      student_books: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          recommendation_level: RecommendationLevel;
          recommendation_reason: string;
          included_in_plan: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          recommendation_level: RecommendationLevel;
          recommendation_reason?: string;
          included_in_plan?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          book_id?: string;
          recommendation_level?: RecommendationLevel;
          recommendation_reason?: string;
          included_in_plan?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      study_plans: {
        Row: {
          id: string;
          user_id: string;
          status: StudyPlanStatus;
          starts_on: string;
          test_date: string;
          generated_at: string;
          activated_at: string | null;
          generation_version: number;
          configuration_snapshot: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: StudyPlanStatus;
          starts_on: string;
          test_date: string;
          generated_at?: string;
          activated_at?: string | null;
          generation_version?: number;
          configuration_snapshot?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: StudyPlanStatus;
          starts_on?: string;
          test_date?: string;
          generated_at?: string;
          activated_at?: string | null;
          generation_version?: number;
          configuration_snapshot?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      assignments: {
        Row: {
          id: string;
          study_plan_id: string;
          user_id: string;
          assignment_date: string;
          assignment_type: AssignmentType;
          book_id: string | null;
          chapter_id: string | null;
          sequence_on_day: number;
          title: string;
          instructions: string;
          estimated_minutes: number;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          study_plan_id: string;
          user_id: string;
          assignment_date: string;
          assignment_type: AssignmentType;
          book_id?: string | null;
          chapter_id?: string | null;
          sequence_on_day?: number;
          title: string;
          instructions?: string;
          estimated_minutes?: number;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          study_plan_id?: string;
          user_id?: string;
          assignment_date?: string;
          assignment_type?: AssignmentType;
          book_id?: string | null;
          chapter_id?: string | null;
          sequence_on_day?: number;
          title?: string;
          instructions?: string;
          estimated_minutes?: number;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      practice_tests: {
        Row: {
          id: string;
          user_id: string;
          assignment_id: string | null;
          test_date: string;
          test_name: string;
          total_score: number;
          math_score: number;
          rw_score: number;
          mistakes_reviewed: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          assignment_id?: string | null;
          test_date: string;
          test_name: string;
          total_score: number;
          math_score: number;
          rw_score: number;
          mistakes_reviewed?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          assignment_id?: string | null;
          test_date?: string;
          test_name?: string;
          total_score?: number;
          math_score?: number;
          rw_score?: number;
          mistakes_reviewed?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      mistakes: {
        Row: {
          id: string;
          user_id: string;
          practice_test_id: string | null;
          assignment_id: string | null;
          source_type: MistakeSourceType;
          section: MistakeSection;
          topic: string;
          question_reference: string | null;
          error_category: string;
          why_error: string;
          correct_reasoning: string;
          lesson_to_remember: string;
          was_guessed: boolean;
          was_retried: boolean;
          retry_correct: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          practice_test_id?: string | null;
          assignment_id?: string | null;
          source_type: MistakeSourceType;
          section: MistakeSection;
          topic: string;
          question_reference?: string | null;
          error_category: string;
          why_error?: string;
          correct_reasoning?: string;
          lesson_to_remember?: string;
          was_guessed?: boolean;
          was_retried?: boolean;
          retry_correct?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          practice_test_id?: string | null;
          assignment_id?: string | null;
          source_type?: MistakeSourceType;
          section?: MistakeSection;
          topic?: string;
          question_reference?: string | null;
          error_category?: string;
          why_error?: string;
          correct_reasoning?: string;
          lesson_to_remember?: string;
          was_guessed?: boolean;
          was_retried?: boolean;
          retry_correct?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      webhook_events: {
        Row: {
          id: string;
          provider: string;
          provider_event_id: string;
          event_type: string;
          processed_at: string | null;
          payload_reference: string | null;
          processing_status: WebhookProcessingStatus;
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          provider: string;
          provider_event_id: string;
          event_type: string;
          processed_at?: string | null;
          payload_reference?: string | null;
          processing_status?: WebhookProcessingStatus;
          error_message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          provider?: string;
          provider_event_id?: string;
          event_type?: string;
          processed_at?: string | null;
          payload_reference?: string | null;
          processing_status?: WebhookProcessingStatus;
          error_message?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      workshop_registrations: {
        Row: {
          id: string;
          student_first_name: string;
          student_last_name: string;
          student_email: string;
          parent_name: string;
          parent_email: string;
          grade: string;
          high_school: string;
          current_score: string | null;
          target_score: string | null;
          target_colleges: string | null;
          main_interest: string;
          referral_source: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_first_name: string;
          student_last_name: string;
          student_email: string;
          parent_name: string;
          parent_email: string;
          grade: string;
          high_school: string;
          current_score?: string | null;
          target_score?: string | null;
          target_colleges?: string | null;
          main_interest: string;
          referral_source?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_first_name?: string;
          student_last_name?: string;
          student_email?: string;
          parent_name?: string;
          parent_email?: string;
          grade?: string;
          high_school?: string;
          current_score?: string | null;
          target_score?: string | null;
          target_colleges?: string | null;
          main_interest?: string;
          referral_source?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      cohort_applications: {
        Row: {
          id: string;
          student_first_name: string;
          student_last_name: string;
          student_email: string;
          student_phone: string | null;
          parent_name: string;
          parent_email: string;
          grade: string;
          high_school: string;
          current_score: string;
          target_score: string;
          next_test_date: string | null;
          gpa: string | null;
          course_rigor: string | null;
          target_colleges: string;
          intended_major: string;
          early_application_plans: string | null;
          extracurriculars: string;
          strongest_activity: string | null;
          weakest_application_area: string | null;
          package_interest: string;
          why_join: string;
          hours_per_week: string;
          biggest_goal: string;
          willing_to_join_community: boolean;
          additional_info: string | null;
          status: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_first_name: string;
          student_last_name: string;
          student_email: string;
          student_phone?: string | null;
          parent_name: string;
          parent_email: string;
          grade: string;
          high_school: string;
          current_score: string;
          target_score: string;
          next_test_date?: string | null;
          gpa?: string | null;
          course_rigor?: string | null;
          target_colleges: string;
          intended_major: string;
          early_application_plans?: string | null;
          extracurriculars: string;
          strongest_activity?: string | null;
          weakest_application_area?: string | null;
          package_interest: string;
          why_join: string;
          hours_per_week: string;
          biggest_goal: string;
          willing_to_join_community: boolean;
          additional_info?: string | null;
          status?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_first_name?: string;
          student_last_name?: string;
          student_email?: string;
          student_phone?: string | null;
          parent_name?: string;
          parent_email?: string;
          grade?: string;
          high_school?: string;
          current_score?: string;
          target_score?: string;
          next_test_date?: string | null;
          gpa?: string | null;
          course_rigor?: string | null;
          target_colleges?: string;
          intended_major?: string;
          early_application_plans?: string | null;
          extracurriculars?: string;
          strongest_activity?: string | null;
          weakest_application_area?: string | null;
          package_interest?: string;
          why_join?: string;
          hours_per_week?: string;
          biggest_goal?: string;
          willing_to_join_community?: boolean;
          additional_info?: string | null;
          status?: string;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      has_sat_planner_access: {
        Args: { p_user_id: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
