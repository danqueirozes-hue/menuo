/**
 * `process.env.NETLIFY` is only reliably set during the Netlify build step,
 * not inside the deployed function at request time (confirmed in production:
 * uploads were crashing with ENOENT trying to write to /var/task/public
 * because that check came back false). Detect the Lambda runtime Netlify
 * Functions actually run on instead — those vars are always present there
 * and never set locally or during `next build`.
 */
export function isNetlifyRuntime(): boolean {
  return Boolean(
    process.env.NETLIFY ||
      process.env.LAMBDA_TASK_ROOT ||
      process.env.AWS_LAMBDA_FUNCTION_NAME
  );
}
