import axios from 'axios';
import { writeFileSync } from 'fs';

const repo = '';
const owner = '';
const token = '';
const workflow_id = ''

let workflowAnalysis: any[] = [];

axios.get(`https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow_id}/runs`, {
    headers: {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Authorization': `Bearer ${token}`
    }
  }
).then((response) => {
  response.data.workflow_runs.forEach((run:any) => {
    const {id, status, conclusion, workflow_id} = run
    let node:any = { id, status, conclusion, workflow_id }
    axios.get(`https://api.github.com/repos/${owner}/${repo}/actions/runs/${id}/jobs`, {
        headers: {
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Authorization': `Bearer ${token}`
        }
      }
    ).then((response) => {
      node['jobs'] = response.data.jobs
      workflowAnalysis.push(node);
      writeFileSync('data.json', JSON.stringify(workflowAnalysis), { flag: 'w'});
    });
  });
});
console.log('Data generated in data.json file');
