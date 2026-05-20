"use client";

export default function CommentForm() {
  return (
    <div className="leave-comment">
      <h4 className="leave-comment-heading">Leave A Comment</h4>
      <form className="form-leave-comment" onSubmit={(e) => e.preventDefault()}>
        <div className="wrap">
          <div className="cols">
            <fieldset className="">
              <input
                className=""
                type="text"
                placeholder="Your Name*"
                name="text"
                tabIndex={2}
                defaultValue=""
                aria-required="true"
                required
              />
            </fieldset>
            <fieldset className="">
              <input
                className=""
                type="email"
                placeholder="Your Email*"
                name="email"
                tabIndex={2}
                defaultValue=""
                aria-required="true"
                required
              />
            </fieldset>
          </div>
          <fieldset className="">
            <textarea
              className=""
              rows={4}
              placeholder="Your Message*"
              tabIndex={2}
              aria-required="true"
              required
              defaultValue={""}
            />
          </fieldset>
        </div>
        <div className="button-submit">
          <button className="" type="submit">
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
}
