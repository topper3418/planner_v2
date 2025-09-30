import { useEffect, useState } from 'react';


const ISSUE_URL = '/api/tickets/';


const issueHook = (thingIds) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchIssues = async (thingIds) => {
    const url = new URL(ISSUE_URL, window.location.origin);
    thingIds.forEach(id => url.searchParams.append('thing_ids', id));
    const include = ['thing', 'category']
    include.forEach(i => url.searchParams.append('include', i));
    url.searchParams.append("parent_id", 0);
    url.searchParams.append("open", "true");
    console.log("Fetching issues from URL:", url.toString());
    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchIssues(thingIds);
  }, []);

  return { data, loading, error, refetch: fetchIssues };
}


export default issueHook;
