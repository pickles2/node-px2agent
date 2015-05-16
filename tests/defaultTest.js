
suite('#TDD()', function() {
  test("まだ準備が整っていない。", function() {
    assert.equal("Sample Test TDD", 3, 'まだ準備が整っていない。');
  });
});

describe('テストする。', function() {
    it("だけどまだ準備が整っていない。", function() {
        expect(3).to.eql("Sample Test BDD");
    });
});


