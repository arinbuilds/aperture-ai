import test from 'node:test';
import assert from 'node:assert/strict';
import {classesPage,myClassesPage,classDetailsMarkup,calendarPage} from './classes-ui.js';

const sample={id:'c1',mentorId:'m1',mentorName:'Mentor One',title:'Accessible web design',description:'Learn to make a welcoming, keyboard-friendly web page.',category:'Web',objectives:'Use headings and labels.',level:'Beginner',startAt:'2099-01-18T13:30:00.000Z',endAt:'2099-01-18T14:30:00.000Z',timezone:'Asia/Kolkata',meetingLink:'https://example.com/private-room',capacity:2,status:'scheduled',resources:[]};
const state=(enrollments=[])=>({role:'user',userId:'learner-1',timezone:'Asia/Kolkata',follows:['m1'],classes:[sample],enrollments});

test('discovery renders followed class metadata without revealing its meeting URL',()=>{
 const html=classesPage(state());assert.match(html,/Accessible web design/);assert.doesNotMatch(html,/private-room/);
});
test('an unenrolled learner does not get meeting link access in details',()=>{
 const html=classDetailsMarkup(sample,state());assert.doesNotMatch(html,/private-room/);assert.match(html,/meeting link is private/i);
});
test('enrolled learner gets meeting access and My Classes listing',()=>{
 const s=state([{classId:'c1',userId:'learner-1',enrolledAt:'2098-01-01T00:00:00Z'}]);assert.match(classDetailsMarkup(sample,s),/private-room/);assert.match(myClassesPage(s),/Accessible web design/);
});
test('cancelled enrolled classes remain visible on the calendar with status',()=>{
 const cancelled={...sample,status:'cancelled'};const s={...state([{classId:'c1',userId:'learner-1',enrolledAt:'2098-01-01T00:00:00Z'}]),classes:[cancelled]};const html=calendarPage(s,'month',new Date('2099-01-01T00:00:00Z'));assert.match(html,/Accessible web design/);assert.match(html,/calendar-event cancelled/);
});
