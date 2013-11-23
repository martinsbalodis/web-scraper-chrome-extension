describe("Queue", function () {

	var q;
	var job;

	beforeEach(function () {
		q = new Queue();
		job = new Job("http://test.lv/", {});
	});

	it("should be able to add items to queue", function () {
		q.add(job);
		expect(q.getQueueSize()).toBe(1);
		expect(q.jobs[0].url).toBe("http://test.lv/");
	});

	it("should be able to mark urls as scraped", function () {

		q.add(job);
		var j = q.getNextJob();
		expect(q.getQueueSize()).toBe(0);

		// try to add this job again
		q.add(job);
		expect(q.getQueueSize()).toBe(0);
	});

	it("should be able to reject documents", function () {

		job = new Job("http://test.lv/test.doc");

		var accepted = q.add(job);
		expect(accepted).toBe(false);
	});

});