import test from 'node:test';
import assert from 'node:assert/strict';
import {localInputToISO,validTimezone,classStatus} from './classes.js';

test('converts mentor local time to UTC using the selected IANA timezone',()=>{
 assert.equal(localInputToISO('2027-01-18T19:00','Asia/Kolkata'),'2027-01-18T13:30:00.000Z');
});
test('uses the correct daylight-saving offset for a London summer class',()=>{
 assert.equal(localInputToISO('2027-06-18T19:00','Europe/London'),'2027-06-18T18:00:00.000Z');
});
test('rejects a local time skipped by daylight-saving transition',()=>{
 assert.throws(()=>localInputToISO('2027-03-28T01:30','Europe/London'),/daylight-saving/);
});
test('rejects invalid IANA timezone names',()=>{
 assert.equal(validTimezone('Mars/Olympus_Mons'),false);
 assert.throws(()=>localInputToISO('2027-01-18T19:00','Mars/Olympus_Mons'),/valid date, time, and timezone/);
});
test('derives completion and cancellation from the canonical class status and end time',()=>{
 assert.equal(classStatus({status:'scheduled',endAt:'2020-01-01T00:00:00.000Z'}),'completed');
 assert.equal(classStatus({status:'cancelled',endAt:'2030-01-01T00:00:00.000Z'}),'cancelled');
});
