import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { courseStyles } from '../config/courseStyles';

const Terms = () => {
  const [styles, setStyles] = useState(courseStyles.cs);
  const [courseType, setCourseType] = useState('cs');

  useEffect(() => {
    // Get courseType from localStorage or use default
    const storedCourseType = localStorage.getItem('courseType') || 'cs';
    setCourseType(storedCourseType);
    setStyles(courseStyles[storedCourseType] || courseStyles.cs);
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Navbar courseType={courseType} />
      <div className="container mx-auto px-4 py-8 pt-24" style={{ maxWidth: '800px', direction: 'ltr', textAlign: 'left' }}>
        <h1 className={`${styles.textSecondary} text-4xl font-bold mb-4`}>TERMS OF USE</h1>
        <p className="mb-8"><strong>Last updated:</strong> May 08, 2025</p>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>AGREEMENT TO OUR LEGAL TERMS</h2>
          <p className="mb-4">
            We are דניאל זיו (or anyone on his behalf), doing business as CS24 ("Company," "we," "us," "our"), a company registered in Israel at Ya'akov Fichman St 18, holon 5810201.
          </p>
          <p className="mb-4">
            We operate the website http://www.cs24.co.il (the "Site"), as well as any other related products and services that refer or link to these legal terms (the "Legal Terms") (collectively, the "Services").
          </p>
          <p className="mb-4">
            CS24 is a student-built academic platform that helps university students in Israel access past exams, study materials, and curated course content. Our goal is to make learning more efficient and less stressful by organizing everything students need in one place, based on their degree, course, and year of study.
          </p>
          <p className="mb-4">
            You can contact us by email at cs24.hit@gmail.com or by mail to Ya'akov Fichman St 18, holon 5810201, Israel.
          </p>
          <p className="mb-4">
            These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and דניאל זיו (or anyone on his behalf), concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
          </p>
          <p className="mb-4">
            Supplemental terms and conditions or documents that may be posted on the Services from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Legal Terms at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of these Legal Terms, and you waive any right to receive specific notice of each such change. It is your responsibility to periodically review these Legal Terms to stay informed of updates. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Legal Terms by your continued use of the Services after the date such revised Legal Terms are posted.
          </p>
          <p className="mb-4">
            All users who are minors in the jurisdiction in which they reside (generally under the age of 18) must have the permission of, and be directly supervised by, their parent or guardian to use the Services. If you are a minor, you must have your parent or guardian read and agree to these Legal Terms prior to you using the Services.
          </p>
          <p className="mb-4">
            We recommend that you print a copy of these Legal Terms for your records.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>TABLE OF CONTENTS</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>OUR SERVICES</li>
            <li>INTELLECTUAL PROPERTY RIGHTS</li>
            <li>USER REPRESENTATIONS</li>
            <li>USER REGISTRATION</li>
            <li>PRODUCTS</li>
            <li>PURCHASES AND PAYMENT</li>
            <li>REFUNDS POLICY</li>
            <li>PROHIBITED ACTIVITIES</li>
            <li>USER GENERATED CONTRIBUTIONS</li>
            <li>CONTRIBUTION LICENSE</li>
            <li>GUIDELINES FOR REVIEWS</li>
            <li>SOCIAL MEDIA</li>
            <li>THIRD-PARTY WEBSITES AND CONTENT</li>
            <li>ADVERTISERS</li>
            <li>SERVICES MANAGEMENT</li>
            <li>PRIVACY POLICY</li>
            <li>COPYRIGHT INFRINGEMENTS</li>
            <li>TERM AND TERMINATION</li>
            <li>MODIFICATIONS AND INTERRUPTIONS</li>
            <li>GOVERNING LAW</li>
            <li>DISPUTE RESOLUTION</li>
            <li>CORRECTIONS</li>
            <li>DISCLAIMER</li>
            <li>LIMITATIONS OF LIABILITY</li>
            <li>INDEMNIFICATION</li>
            <li>USER DATA</li>
            <li>ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</li>
            <li>MISCELLANEOUS</li>
            <li>ACADEMIC INTEGRITY CLAUSE</li>
            <li>EDUCATIONAL USE ONLY</li>
            <li>SYSTEM ABUSE & FAIR USAGE</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>1. OUR SERVICES</h2>
          <p className="mb-4">
            The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>2. INTELLECTUAL PROPERTY RIGHTS</h2>
          <h3 className={`${styles.textSecondary} text-xl font-bold mb-2`}>Our intellectual property</h3>
          <p className="mb-4">
            We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the "Content"), as well as the trademarks, service marks, and logos contained therein (the "Marks").
          </p>
          <p className="mb-4">
            Our Content and Marks are protected by copyright and trademark laws (and various other intellectual property rights and unfair competition laws) and treaties around the world.
          </p>
          <p className="mb-4">
            The Content and Marks are provided in or through the Services "AS IS" for your personal, non-commercial use only.
          </p>

          <h3 className={`${styles.textSecondary} text-xl font-bold mb-2`}>Your use of our Services</h3>
          <p className="mb-4">
            Subject to your compliance with these Legal Terms, including the "PROHIBITED ACTIVITIES" section below, we grant you a non-exclusive, non-transferable, revocable license to:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>access the Services; and</li>
            <li>download or print a copy of any portion of the Content to which you have properly gained access,</li>
          </ul>
          <p className="mb-4">
            solely for your personal, non-commercial use.
          </p>
          <p className="mb-4">
            Except as set out in this section or elsewhere in our Legal Terms, no part of the Services and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>3. USER REPRESENTATIONS</h2>
          <p className="mb-4">
            By using the Services, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Legal Terms; (4) you are not a minor in the jurisdiction in which you reside, or if a minor, you have received parental permission to use the Services; (5) you will not access the Services through automated or non-human means, whether through a bot, script or otherwise; (6) you will not use the Services for any illegal or unauthorized purpose; and (7) your use of the Services will not violate any applicable law or regulation.
          </p>
          <p className="mb-4">
            If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Services (or any portion thereof).
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>4. USER REGISTRATION</h2>
          <p className="mb-4">
            You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>5. PRODUCTS</h2>
          <p className="mb-4">
            All products are subject to availability. We reserve the right to discontinue any products at any time for any reason. Prices for all products are subject to change.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>6. PURCHASES AND PAYMENT</h2>
          <p className="mb-4">We accept the following forms of payment:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Visa</li>
            <li>Mastercard</li>
            <li>PayPal</li>
            <li>Apple Pay</li>
            <li>Google Pay</li>
          </ul>
          <p className="mb-4">
            You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Services. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed. Sales tax will be added to the price of purchases as deemed required by us. We may change prices at any time. All payments shall be in ILS.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>7. REFUNDS POLICY</h2>
          <p className="mb-4">All sales are final and no refund will be issued.</p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>8. PROHIBITED ACTIVITIES</h2>
          <p className="mb-4">
            You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
          </p>
          <p className="mb-4">As a user of the Services, you agree not to:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
            <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
            <li>Circumvent, disable, or otherwise interfere with security-related features of the Services.</li>
            <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.</li>
            <li>Use any information obtained from the Services in order to harass, abuse, or harm another person.</li>
            <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
            <li>Use the Services in a manner inconsistent with any applicable laws or regulations.</li>
            <li>Engage in unauthorized framing of or linking to the Services.</li>
            <li>Upload or transmit viruses, Trojan horses, or other material that interferes with any party's uninterrupted use and enjoyment of the Services.</li>
            <li>Engage in any automated use of the system, such as using scripts to send comments or messages.</li>
            <li>Delete the copyright or other proprietary rights notice from any Content.</li>
            <li>Attempt to impersonate another user or person or use the username of another user.</li>
            <li>Interfere with, disrupt, or create an undue burden on the Services or the networks or services connected to the Services.</li>
            <li>Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Services to you.</li>
            <li>Attempt to bypass any measures of the Services designed to prevent or restrict access to the Services.</li>
            <li>Copy or adapt the Services' software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.</li>
            <li>Decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Services.</li>
            <li>Use, launch, develop, or distribute any automated system, including without limitation, any spider, robot, cheat utility, scraper, or offline reader that accesses the Services.</li>
            <li>Use a buying agent or purchasing agent to make purchases on the Services.</li>
            <li>Make any unauthorized use of the Services, including collecting usernames and/or email addresses of users by electronic or other means.</li>
            <li>Use the Services as part of any effort to compete with us or otherwise use the Services and/or the Content for any revenue-generating endeavor or commercial enterprise.</li>
            <li>Sell or otherwise transfer your profile.</li>
            <li>Use the Services to advertise or offer to sell goods and services.</li>
            <li>Upload copyrighted materials without permission.</li>
            <li>Share access to paid content without authorization.</li>
            <li>Post false, misleading, or outdated academic materials.</li>
            <li>Harvest or scrape user data or course content.</li>
            <li>Use bots or automation to download site content.</li>
            <li>Impersonate tutors, admins, or other students.</li>
            <li>Distribute harmful or malicious code through file uploads.</li>
            <li>Accessing the platform from more devices than permitted.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>9. USER GENERATED CONTRIBUTIONS</h2>
          <p className="mb-4">
            The Services may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality, and may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Services, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, "Contributions"). Contributions may be viewable by other users of the Services and through third-party websites. As such, any Contributions you transmit may be treated as non-confidential and non-proprietary. When you create or make available any Contributions, you thereby represent and warrant that:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>The creation, distribution, transmission, public display, or performance, and the accessing, downloading, or copying of your Contributions do not and will not infringe the proprietary rights, including but not limited to the copyright, patent, trademark, trade secret, or moral rights of any third party.</li>
            <li>You are the creator and owner of or have the necessary licenses, rights, consents, releases, and permissions to use and to authorize us, the Services, and other users of the Services to use your Contributions in any manner contemplated by the Services and these Legal Terms.</li>
            <li>You have the written consent, release, and/or permission of each and every identifiable individual person in your Contributions to use the name or likeness of each and every such identifiable individual person to enable inclusion and use of your Contributions in any manner contemplated by the Services and these Legal Terms.</li>
            <li>Your Contributions are not false, inaccurate, or misleading.</li>
            <li>Your Contributions are not unsolicited or unauthorized advertising, promotional materials, pyramid schemes, chain letters, spam, mass mailings, or other forms of solicitation.</li>
            <li>Your Contributions are not obscene, lewd, lascivious, filthy, violent, harassing, libelous, slanderous, or otherwise objectionable (as determined by us).</li>
            <li>Your Contributions do not ridicule, mock, disparage, intimidate, or abuse anyone.</li>
            <li>Your Contributions are not used to harass or threaten (in the legal sense of those terms) any other person and to promote violence against a specific person or class of people.</li>
            <li>Your Contributions do not violate any applicable law, regulation, or rule.</li>
            <li>Your Contributions do not violate the privacy or publicity rights of any third party.</li>
            <li>Your Contributions do not violate any applicable law concerning child pornography, or otherwise intended to protect the health or well-being of minors.</li>
            <li>Your Contributions do not include any offensive comments that are connected to race, national origin, gender, sexual preference, or physical handicap.</li>
            <li>Your Contributions do not otherwise violate, or link to material that violates, any provision of these Legal Terms, or any applicable law or regulation.</li>
          </ul>
          <p className="mb-4">
            Any use of the Services in violation of the foregoing violates these Legal Terms and may result in, among other things, termination or suspension of your rights to use the Services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>10. CONTRIBUTION LICENSE</h2>
          <p className="mb-4">
            By posting your Contributions to any part of the Services or making Contributions accessible to the Services by linking your account from the Services to any of your social networking accounts, you automatically grant, and you represent and warrant that you have the right to grant, to us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right, and license to host, use, copy, reproduce, disclose, sell, resell, publish, broadcast, retitle, archive, store, cache, publicly perform, publicly display, reformat, translate, transmit, excerpt (in whole or in part), and distribute such Contributions (including, without limitation, your image and voice) for any purpose, commercial, advertising, or otherwise, and to prepare derivative works of, or incorporate into other works, such Contributions, and grant and authorize sublicenses of the foregoing. The use and distribution may occur in any media formats and through any media channels.
          </p>
          <p className="mb-4">
            This license will apply to any form, media, or technology now known or hereafter developed, and includes our use of your name, company name, and franchise name, as applicable, and any of the trademarks, service marks, trade names, logos, and personal and commercial images you provide. You waive all moral rights in your Contributions, and you warrant that moral rights have not otherwise been asserted in your Contributions.
          </p>
          <p className="mb-4">
            We do not assert any ownership over your Contributions. You retain full ownership of all of your Contributions and any intellectual property rights or other proprietary rights associated with your Contributions. We are not liable for any statements or representations in your Contributions provided by you in any area on the Services. You are solely responsible for your Contributions to the Services and you expressly agree to exonerate us from any and all responsibility and to refrain from any legal action against us regarding your Contributions.
          </p>
          <p className="mb-4">
            We have the right, in our sole and absolute discretion, (1) to edit, redact, or otherwise change any Contributions; (2) to re-categorize any Contributions to place them in more appropriate locations on the Services; and (3) to pre-screen or delete any Contributions at any time and for any reason, without notice. We have no obligation to monitor your Contributions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>11. GUIDELINES FOR REVIEWS</h2>
          <p className="mb-4">
            We may provide you areas on the Services to leave reviews or ratings. When posting a review, you must comply with the following criteria: (1) you should have firsthand experience with the person/entity being reviewed; (2) your reviews should not contain offensive profanity, or abusive, racist, offensive, or hateful language; (3) your reviews should not contain discriminatory references based on religion, race, gender, national origin, age, marital status, sexual orientation, or disability; (4) your reviews should not contain references to illegal activity; (5) you should not be affiliated with competitors if posting negative reviews; (6) you should not make any conclusions as to the legality of conduct; (7) you may not post any false or misleading statements; and (8) you may not organize a campaign encouraging others to post reviews, whether positive or negative.
          </p>
          <p className="mb-4">
            We may accept, reject, or remove reviews in our sole discretion. We have absolutely no obligation to screen reviews or to delete reviews, even if anyone considers reviews objectionable or inaccurate. Reviews are not endorsed by us, and do not necessarily represent our opinions or the views of any of our affiliates or partners. We do not assume liability for any review or for any claims, liabilities, or losses resulting from any review. By posting a review, you hereby grant to us a perpetual, non-exclusive, worldwide, royalty-free, fully paid, assignable, and sublicensable right and license to reproduce, modify, translate, transmit by any means, display, perform, and/or distribute all content relating to review.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>12. SOCIAL MEDIA</h2>
          <p className="mb-4">
            As part of the functionality of the Services, you may link your account with online accounts you have with third-party service providers (each such account, a "Third-Party Account") by either: (1) providing your Third-Party Account login information through the Services; or (2) allowing us to access your Third-Party Account, as is permitted under the applicable terms and conditions that govern your use of each Third-Party Account. You represent and warrant that you are entitled to disclose your Third-Party Account login information to us and/or grant us access to your Third-Party Account, without breach by you of any of the terms and conditions that govern your use of the applicable Third-Party Account, and without obligating us to pay any fees or making us subject to any usage limitations imposed by the third-party service provider of the Third-Party Account. By granting us access to any Third-Party Accounts, you understand that (1) we may access, make available, and store (if applicable) any content that you have provided to and stored in your Third-Party Account (the "Social Network Content") so that it is available on and through the Services via your account, including without limitation any friend lists and (2) we may submit to and receive from your Third-Party Account additional information to the extent you are notified when you link your account with the Third-Party Account. Depending on the Third-Party Accounts you choose and subject to the privacy settings that you have set in such Third-Party Accounts, personally identifiable information that you post to your Third-Party Accounts may be available on and through your account on the Services. Please note that if a Third-Party Account or associated service becomes unavailable or our access to such Third-Party Account is terminated by the third-party service provider, then Social Network Content may no longer be available on and through the Services. You will have the ability to disable the connection between your account on the Services and your Third-Party Accounts at any time. PLEASE NOTE THAT YOUR RELATIONSHIP WITH THE THIRD-PARTY SERVICE PROVIDERS ASSOCIATED WITH YOUR THIRD-PARTY ACCOUNTS IS GOVERNED SOLELY BY YOUR AGREEMENT(S) WITH SUCH THIRD-PARTY SERVICE PROVIDERS. We make no effort to review any Social Network Content for any purpose, including but not limited to, for accuracy, legality, or non-infringement, and we are not responsible for any Social Network Content. You acknowledge and agree that we may access your email address book associated with a Third-Party Account and your contacts list stored on your mobile device or tablet computer solely for purposes of identifying and informing you of those contacts who have also registered to use the Services. You can deactivate the connection between the Services and your Third-Party Account by contacting us using the contact information below or through your account settings (if applicable). We will attempt to delete any information stored on our servers that was obtained through such Third-Party Account, except the username and profile picture that become associated with your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>13. THIRD-PARTY WEBSITES AND CONTENT</h2>
          <p className="mb-4">
            The Services may contain (or you may be sent via the Site) links to other websites ("Third-Party Websites") as well as articles, photographs, text, graphics, pictures, designs, music, sound, video, information, applications, software, and other content or items belonging to or originating from third parties ("Third-Party Content"). Such Third-Party Websites and Third-Party Content are not investigated, monitored, or checked for accuracy, appropriateness, or completeness by us, and we are not responsible for any Third-Party Websites accessed through the Services or any Third-Party Content posted on, available through, or installed from the Services, including the content, accuracy, offensiveness, opinions, reliability, privacy practices, or other policies or of contained in the Third-Party Websites or the Third-Party Content. Inclusion of, linking to, or permitting the use or installation of any Third-Party Websites or any Third-Party Content does not imply approval or endorsement thereof by us. If you decide to leave the Services and access the Third-Party Websites or to use or install any Third-Party Content, you do so at your own risk, and you should be aware these Legal Terms no longer govern. You should review the applicable terms and policies, including privacy and data gathering practices, of any website to which you navigate from the Services or relating to any applications you use or install from the Services. Any purchases you make through Third-Party Websites will be through other websites and from other companies, and we take no responsibility whatsoever in relation to such purchases which are exclusively between you and the applicable third party. You agree and acknowledge that we do not endorse the products or services offered on Third-Party Websites and you shall hold us blameless from any harm caused by your purchase of such products or services. Additionally, you shall hold us blameless from any losses sustained by you or harm caused to you relating to or resulting in any way from any Third-Party Content or any contact with Third-Party Websites.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>14. ADVERTISERS</h2>
          <p className="mb-4">
            We allow advertisers to display their advertisements and other information in certain areas of the Services, such as sidebar advertisements or banner advertisements. We simply provide the space to place such advertisements, and we have no other relationship with advertisers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>15. SERVICES MANAGEMENT</h2>
          <p className="mb-4">
            We reserve the right, but not the obligation, to: (1) monitor the Services for violations of these Legal Terms; (2) take appropriate legal action against anyone who, in our sole discretion, violates the law or these Legal Terms, including without limitation, reporting such user to law enforcement authorities; (3) in our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or disable (to the extent technologically feasible) any of your Contributions or any portion thereof; (4) in our sole discretion and without limitation, notice, or liability, to remove from the Services or otherwise disable all files and content that are excessive in size or are in any way burdensome to our systems; and (5) otherwise manage the Services in a manner designed to protect our rights and property and to facilitate the proper functioning of the Services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>16. PRIVACY POLICY</h2>
          <p className="mb-4">
            We care about data privacy and security. Please review our Privacy Policy: https://cs24.co.il/privacy. By using the Services, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms. Please be advised the Services are hosted in Israel. If you access the Services from any other region of the world with laws or other requirements governing personal data collection, use, or disclosure that differ from applicable laws in Israel, then through your continued use of the Services, you are transferring your data to Israel, and you expressly consent to have your data transferred to and processed in Israel.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>17. COPYRIGHT INFRINGEMENTS</h2>
          <p className="mb-4">
            We respect the intellectual property rights of others. If you believe that any material available on or through the Services infringes upon any copyright you own or control, please immediately notify us using the contact information provided below (a "Notification"). A copy of your Notification will be sent to the person who posted or stored the material addressed in the Notification. Please be advised that pursuant to applicable law you may be held liable for damages if you make material misrepresentations in a Notification. Thus, if you are not sure that material located on or linked to by the Services infringes your copyright, you should consider first contacting an attorney.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>18. TERM AND TERMINATION</h2>
          <p className="mb-4">
            These Legal Terms shall remain in full force and effect while you use the Services. WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION IN THE SERVICES OR DELETE YOUR ACCOUNT AND ANY CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT WARNING, IN OUR SOLE DISCRETION.
          </p>
          <p className="mb-4">
            If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party, even if you may be acting on behalf of the third party. In addition to terminating or suspending your account, we reserve the right to take appropriate legal action, including without limitation pursuing civil, criminal, and injunctive redress.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>19. MODIFICATIONS AND INTERRUPTIONS</h2>
          <p className="mb-4">
            We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Services. We also reserve the right to modify or discontinue all or part of the Services without notice at any time. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Services.
          </p>
          <p className="mb-4">
            We cannot guarantee the Services will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the Services, resulting in interruptions, delays, or errors. We reserve the right to change, revise, update, suspend, discontinue, or otherwise modify the Services at any time or for any reason without notice to you. You agree that we have no liability whatsoever for any loss, damage, or inconvenience caused by your inability to access or use the Services during any downtime or discontinuance of the Services. Nothing in these Legal Terms will be construed to obligate us to maintain and support the Services or to supply any corrections, updates, or releases in connection therewith.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>20. GOVERNING LAW</h2>
          <p className="mb-4">
            These Legal Terms shall be governed by and defined following the laws of Israel. דניאל זיו (or anyone on his behalf) and yourself irrevocably consent that the courts of Israel shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these Legal Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>21. DISPUTE RESOLUTION</h2>
          <h3 className={`${styles.textSecondary} text-xl font-bold mb-2`}>Informal Negotiations</h3>
          <p className="mb-4">
            To expedite resolution and control the cost of any dispute, controversy, or claim related to these Legal Terms (each a "Dispute" and collectively, the "Disputes") brought by either you or us (individually, a "Party" and collectively, the "Parties"), the Parties agree to first attempt to negotiate any Dispute (except those Disputes expressly provided below) informally for at least thirty (30) days before initiating arbitration. Such informal negotiations commence upon written notice from one Party to the other Party.
          </p>

          <h3 className={`${styles.textSecondary} text-xl font-bold mb-2`}>Binding Arbitration</h3>
          <p className="mb-4">
            Any dispute arising out of or in connection with these Legal Terms, including any question regarding its existence, validity, or termination, shall be referred to and finally resolved by the International Commercial Arbitration Court under the European Arbitration Chamber (Belgium, Brussels, Avenue Louise, 146) according to the Rules of this ICAC, which, as a result of referring to it, is considered as the part of this clause. The number of arbitrators shall be one (1). The seat, or legal place, of arbitration shall be Tel Aviv, Israel. The language of the proceedings shall be Hebrew. The governing law of these Legal Terms shall be substantive law of Israel.
          </p>

          <h3 className={`${styles.textSecondary} text-xl font-bold mb-2`}>Restrictions</h3>
          <p className="mb-4">
            The Parties agree that any arbitration shall be limited to the Dispute between the Parties individually. To the full extent permitted by law, (a) no arbitration shall be joined with any other proceeding; (b) there is no right or authority for any Dispute to be arbitrated on a class-action basis or to utilize class action procedures; and (c) there is no right or authority for any Dispute to be brought in a purported representative capacity on behalf of the general public or any other persons.
          </p>

          <h3 className={`${styles.textSecondary} text-xl font-bold mb-2`}>Exceptions to Informal Negotiations and Arbitration</h3>
          <p className="mb-4">
            The Parties agree that the following Disputes are not subject to the above provisions concerning informal negotiations binding arbitration: (a) any Disputes seeking to enforce or protect, or concerning the validity of, any of the intellectual property rights of a Party; (b) any Dispute related to, or arising from, allegations of theft, piracy, invasion of privacy, or unauthorized use; and (c) any claim for injunctive relief. If this provision is found to be illegal or unenforceable, then neither Party will elect to arbitrate any Dispute falling within that portion of this provision found to be illegal or unenforceable and such Dispute shall be decided by a court of competent jurisdiction within the courts listed for jurisdiction above, and the Parties agree to submit to the personal jurisdiction of that court.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>22. CORRECTIONS</h2>
          <p className="mb-4">
            There may be information on the Services that contains typographical errors, inaccuracies, or omissions, including descriptions, pricing, availability, and various other information. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information on the Services at any time, without prior notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>23. DISCLAIMER</h2>
          <p className="mb-4">
            THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICES' CONTENT OR THE CONTENT OF ANY WEBSITES OR MOBILE APPLICATIONS LINKED TO THE SERVICES AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS, (2) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE SERVICES, (3) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN, (4) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SERVICES, (5) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH THE SERVICES BY ANY THIRD PARTY, AND/OR (6) ANY ERRORS OR OMISSIONS IN ANY CONTENT AND MATERIALS OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICES. WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH THE SERVICES, ANY HYPERLINKED WEBSITE, OR ANY WEBSITE OR MOBILE APPLICATION FEATURED IN ANY BANNER OR OTHER ADVERTISING, AND WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND ANY THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES. AS WITH THE PURCHASE OF A PRODUCT OR SERVICE THROUGH ANY MEDIUM OR IN ANY ENVIRONMENT, YOU SHOULD USE YOUR BEST JUDGMENT AND EXERCISE CAUTION WHERE APPROPRIATE.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>24. LIMITATIONS OF LIABILITY</h2>
          <p className="mb-4">
            IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE LESSER OF THE AMOUNT PAID, IF ANY, BY YOU TO US OR 100. CERTAIN US STATE LAWS AND INTERNATIONAL LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MAY HAVE ADDITIONAL RIGHTS.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>25. INDEMNIFICATION</h2>
          <p className="mb-4">
            You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys' fees and expenses, made by any third party due to or arising out of: (1) your Contributions; (2) use of the Services; (3) breach of these Legal Terms; (4) any breach of your representations and warranties set forth in these Legal Terms; (5) your violation of the rights of a third party, including but not limited to intellectual property rights; or (6) any overt harmful act toward any other user of the Services with whom you connected via the Services. Notwithstanding the foregoing, we reserve the right, at your expense, to assume the exclusive defense and control of any matter for which you are required to indemnify us, and you agree to cooperate, at your expense, with our defense of such claims. We will use reasonable efforts to notify you of any such claim, action, or proceeding which is subject to this indemnification upon becoming aware of it.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>26. USER DATA</h2>
          <p className="mb-4">
            We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your use of the Services. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Services. You agree that we shall have no liability to you for any loss or corruption of any such data, and you hereby waive any right of action against us arising from any such loss or corruption of such data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>27. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</h2>
          <p className="mb-4">
            Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically, via email and on the Services, satisfy any legal requirement that such communication be in writing. YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SERVICES. You hereby waive any rights or requirements under any statutes, regulations, rules, ordinances, or other laws in any jurisdiction which require an original signature or delivery or retention of non-electronic records, or to payments or the granting of credits by any means other than electronic means.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>28. MISCELLANEOUS</h2>
          <p className="mb-4">
            These Legal Terms and any policies or operating rules posted by us on the Services or in respect to the Services constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Legal Terms shall not operate as a waiver of such right or provision. These Legal Terms operate to the fullest extent permissible by law. We may assign any or all of our rights and obligations to others at any time. We shall not be responsible or liable for any loss, damage, delay, or failure to act caused by any cause beyond our reasonable control. If any provision or part of a provision of these Legal Terms is determined to be unlawful, void, or unenforceable, that provision or part of the provision is deemed severable from these Legal Terms and does not affect the validity and enforceability of any remaining provisions. There is no joint venture, partnership, employment or agency relationship created between you and us as a result of these Legal Terms or use of the Services. You agree that these Legal Terms will not be construed against us by virtue of having drafted them. You hereby waive any and all defenses you may have based on the electronic form of these Legal Terms and the lack of signing by the parties hereto to execute these Legal Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>29. ACADEMIC INTEGRITY CLAUSE</h2>
          <p className="mb-4">
            Users are prohibited from uploading, sharing, or distributing any materials that violate the academic integrity policies of their institution. This includes but is not limited to leaked exams, impersonation, or unauthorized solutions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>30. EDUCATIONAL USE ONLY</h2>
          <p className="mb-4">
            The platform and its contents are intended solely for educational and personal academic use. Users may not repurpose, resell, or distribute materials for commercial gain without prior written consent from CS24.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>31. SYSTEM ABUSE & FAIR USAGE</h2>
          <p className="mb-4">
            Users must not attempt to bypass platform limits (e.g., concurrent logins or scraping), upload malicious code, or interfere with server resources. Excessive usage patterns may lead to account suspension or legal action.
          </p>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>CONTACT US</h2>
          <p className="mb-4">In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:</p>
          <p className="mb-2">דניאל זיו</p>
          <p className="mb-2">Ya'akov Fichman St 18</p>
          <p className="mb-2">holon 5810201</p>
          <p className="mb-2">Israel</p>
          <p>
            <a 
              href="mail to: cs24.hit@gmail.com"
              className={`${styles.textSecondary} hover:text-blue-700 underline`}
            >
              cs24.hit@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms; 