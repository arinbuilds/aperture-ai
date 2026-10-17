import test from 'node:test';
import assert from 'node:assert/strict';
import {skillEvidence,analyticsMarkup,communitiesMarkup,recordSkillRatings,SAMPLE_MENTORS,SAMPLE_COMMUNITIES} from './platform.js';
import {escapeHTML as e,INITIAL} from './core.js';
const button=(label,action)=>`<button data-action="${action}">${label}</button>`;

test('skill evidence distinguishes self-reported skills from skills linked to a project',()=>{
 const rows=skillEvidence(INITIAL);
 const html=rows.find(x=>x.skill==='HTML');
 const git=rows.find(x=>x.skill==='Git');
 assert.equal(html.projects.length,1);
 assert.equal(html.selfReported,true);
 assert.equal(git.projects.length,0);
 assert.equal(git.selfReported,true);
});

test('analytics shows profile and clearly marked demo placeholders before ratings exist',()=>{
 const html=analyticsMarkup(INITIAL,e,button);
 assert.match(html,/Where you stand/);
 assert.match(html,/DEMO · RANDOM PLACEHOLDER · NOT FROM VIDEO/);assert.match(html,/\d{1,3}\/100/);
 assert.doesNotMatch(html,/Skill knowledge graph|CONNECTED KNOWLEDGE/);
 assert.match(html,/Professional skill profile/);
 assert.match(html,/Self-reported/);
 assert.match(html,/out of 100/);
 assert.doesNotMatch(html,/chess|Practice ratings|ready for your first match/i);
 assert.match(html,/A plan to improve/);
});

test('practice ratings update per skill from the clip estimate and remain bounded',()=>{
 const one=recordSkillRatings([], [{name:'Footwork',rating:70}], 'Basketball drill', '2026-10-17T10:00:00Z');
 assert.equal(one[0].skill,'Footwork');assert.equal(one[0].rating,70);assert.equal(one[0].score,70);assert.equal(one[0].delta,null);
 const two=recordSkillRatings(one,[{name:'Footwork',rating:80}],'Basketball drill','2026-10-18T10:00:00Z');
 assert.ok(two[1].rating>two[0].rating);assert.equal(two[1].delta,10);
 assert.equal(recordSkillRatings([], [{name:'Unknown',rating:180}], 'Clip')[0].rating,100);
 assert.equal(recordSkillRatings([{skill:'Footwork',rating:832}], [{name:'Footwork',rating:35}], 'Clip')[1].delta,15);
 assert.equal(recordSkillRatings([], [{name:'Footwork'}], 'Clip').length,0);
 assert.equal(recordSkillRatings([], [{name:'Footwork',rating:''}], 'Clip').length,0);
 assert.equal(recordSkillRatings([], [{name:'Footwork',rating:0}], 'Clip').length,0);
});

test('analytics turns saved video feedback into a specific practice plan',()=>{
 const profile=structuredClone(INITIAL);
 profile.projects.push({id:'recent-review',title:'Free-throw practice',description:'A reviewed basketball practice clip with visible form notes.',skills:['Shooting form'],improvements:['Keep your elbow aligned through the release.','Hold the follow-through until the ball reaches the rim.'],evidenceType:'ai-video-reviewed'});
 const history=recordSkillRatings([], [{name:'Shooting form',rating:64}], 'Free-throw practice','2026-10-17T10:00:00Z');
 const html=analyticsMarkup(profile,e,button,history);
 assert.match(html,/Shooting form/);assert.match(html,/64\/100/);assert.match(html,/Keep your elbow aligned through the release/);assert.match(html,/Hold the follow-through/);
 assert.match(html,/aria-valuemax="100"/);assert.doesNotMatch(html,/score of 64|chess/i);
});

test('video skills without a returned rating get stable, clearly labeled demo scores',()=>{
 const profile=structuredClone(INITIAL);
 profile.projects.push({id:'review',title:'Soccer practice',description:'A reviewed shooting clip.',skills:['Plant foot placement'],improvements:[],evidenceType:'ai-video-reviewed'});
 const html=analyticsMarkup(profile,e,button,[{skill:'Plant foot placement',rating:832,score:0,delta:-168,activity:'Soccer practice',at:'2026-10-17T10:00:00Z'},{skill:'Plant foot placement',rating:0,score:0,delta:0,activity:'Soccer practice',at:'2026-10-18T10:00:00Z'}]);
 assert.match(html,/Plant foot placement/);assert.match(html,/\d{1,3}\/100/);assert.match(html,/DEMO · RANDOM PLACEHOLDER · NOT FROM VIDEO/);
 assert.match(html,/random demo number fills the graph/);assert.match(html,/never used in improvement advice/);
 assert.doesNotMatch(html,/0\/100|Not scored|832|chess/i);
});

test('discussion and mentor interfaces are clearly demo-labeled and have no video publishing flow',()=>{
 assert.ok(SAMPLE_MENTORS.length>=3);
 assert.ok(SAMPLE_COMMUNITIES.length>=3);
 const html=communitiesMarkup({posts:[],joined:[],votes:{}},e);
 assert.match(html,/saved in this browser/);
 assert.match(html,/community-post-form/);
 assert.doesNotMatch(html,/upload video|publish video|teaching studio/i);
});

test('user-authored discussion fields are escaped before display',()=>{
 const html=communitiesMarkup({posts:[{id:'1',community:'learn-python',title:'<script>alert(1)</script>',body:'<img src=x onerror=alert(1)>',author:'<b>Ravi</b>',createdAt:new Date(0).toISOString(),votes:0}],joined:[],votes:{}},e);
 assert.doesNotMatch(html,/<script>/);
 assert.doesNotMatch(html,/<img/);
 assert.match(html,/&lt;script&gt;/);
});

test('community feed supports sorted views and comment threads',()=>{
 const html=communitiesMarkup({posts:[{id:'1',community:'web-builders',title:'How do I improve keyboard navigation?',body:'I am building my first portfolio.',author:'Ravi',createdAt:new Date().toISOString(),votes:2,comments:[{author:'Mina',body:'Try tabbing through the page once.'}]}],joined:['web-builders'],votes:{'1':true},feedSort:'top'},e);
 assert.match(html,/aria-pressed="true">Top/);assert.match(html,/How do I improve keyboard navigation\?/);assert.match(html,/Try tabbing through the page once\./);assert.match(html,/class="comment-form"/);
});
