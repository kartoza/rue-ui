import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Checkbox, Container, Text } from '@chakra-ui/react';
import logo from '../../assets/logo.jpg';

import './style.scss';

const Home: React.FC = () => {
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  return (
    <Container>
      <Box p={4}>
        <Box className="home-logo">
          <img src={logo} alt="Logo" className="mauto" />
        </Box>
        <Box>
          <h2>About</h2>
          <br />
          <p>
            <i>
              The Rapid Urbanism Explorer is an Augmented Intelligence (AI) Platform to strengthen
              collaboration amongst decision makers in developing new urban districts in advanced
              ways.&nbsp;
            </i>
            Rapid iterative virtual prototyping empowers stakeholders to produce complex
            urbanization scenarios integrating spatial, temporal, socioeconomic and environmental
            parameters in real time. Further info on{' '}
            <Link to="www.RapidUrbanism.com/Explorer-AI">www.RapidUrbanism.com/Explorer-AI</Link>.
          </p>
        </Box>
        <hr />
        <Box>
          <h2>Terms and Conditions</h2>
          <section className="h-40" style={{ overflowX: 'hidden', paddingRight: '1rem' }}>
            <article>
              <h4 className="ant-typography">Terms of Use</h4>
              <div
                className="ant-typography"
                style={{ textAlign: 'justify', marginBottom: '1rem' }}
              >
                Please read these terms of use ("terms of use”, "agreement") carefully before using
                the
                <a
                  className="ant-typography"
                  target="_blank"
                  href="http://www.rapidurbanism.com"
                  rel="noopener noreferrer"
                >
                  {' '}
                  www.RapidUrbanism.com{' '}
                </a>
                website, including any subdomains hosting versions of the Rapid Urbanism Explorer
                (“Explorer”), such as
                <a
                  className="ant-typography"
                  target="_blank"
                  href="http://explorer.rapidurbanism.com"
                  rel="noopener noreferrer"
                >
                  {' '}
                  Explorer.RapidUrbanism.com{' '}
                </a>
                or
                <a
                  className="ant-typography"
                  target="_blank"
                  href="http://rue03.rapidurbanism.com"
                  rel="noopener noreferrer"
                >
                  {' '}
                  RUE03.RapidUrbanism.com{' '}
                </a>
                , ("website", "service") operated by
                <em> IAUAI gGmbH / Rapid Urbanism alias Matthias Nohn </em> ("us”, “we", "our”).
                IAUAI gGmbH shall be solely responsible for any content related to the Explorer,
                especially any prototype (see below) – while
                <em> Rapid Urbanism alias Matthias Nohn </em> is a service provider to IAUAI, only.
              </div>
              <h4 className="ant-typography">Conditions of Use</h4>
              <Text className="ant-typography" textAlign="justify">
                By using this website, you certify that you have read and reviewed this Agreement
                and that you agree to comply with its terms. If you do not want to be bound by the
                terms of this Agreement, you are advised to leave the website accordingly. We only
                grant use and access of this website, its products, and its services to those who
                have accepted its terms.
              </Text>

              <h4 className="ant-typography">Demonstration Purpose Only</h4>
              <Text className="ant-typography" style={{ textAlign: 'justify' }}>
                <i>
                  {' '}
                  This website provides access to an early prototype of the Explorer (“Prototype”)
                  for demonstration purposes, solely.{' '}
                </i>
                In contrast, the use for real-life applications shall be considered outside of the
                uses permitted under this Agreement. (For exceptions see
                <i> Option for Real-Life Application </i>.) The Prototype may not be expected to be
                fit for real-life applications. Consequently, it shall be expected that the use of
                the Prototype for real-life applications (e.g., real urban projects) is severely
                risky and potentially harmful. Harm may include but is not limited to loss and/or
                misuse of data, or the generation of unfeasible or unsafe scenarios – even though
                appearing feasible or safe in the simulation, possibly. Therefore, the use of the
                Prototype for real-life projects but without professional support and comprehensive
                due diligence shall be considered outside of the permitted terms of use, and we
                assume no responsibility for liabilities related to misuse.
              </Text>

              <h4 className="ant-typography">Option for Real-Life Application</h4>
              <Text className="ant-typography" style={{ textAlign: 'justify' }}>
                Conditional on the combination with professional advisory services, the Prototype
                may provide the basis for further development towards the deployment in real-life
                applications, including but not limited to urban projects, policy analysis, or
                education.
              </Text>

              <Text className="ant-typography" style={{ textAlign: 'justify' }}>
                If so, any use of the Prototype shall be at the sole risk and full responsibility of
                the (compulsory) professional service provider who shall perform due diligence on
                all aspects of the project and the Explorer, including but not limited to software
                and model architectures, parameters and algorithms, all inputs and outputs, and data
                security. If so, subject to the terms described under
                <i> Intellectual property </i>below, the Explorer shall be installed on a website
                controlled by the service provider and – as may be needed – be adapted and further
                developed to meet the requirements of the specific case.
              </Text>

              <Text className="ant-typography" style={{ textAlign: 'justify' }}>
                IAUAI gGmbH offers the required professional advisory services on demand and against
                fair compensation. You are free to procure the services by any other qualified
                entity.
              </Text>

              <h4 className="ant-typography">Privacy Policy</h4>
              <Text className="ant-typography" style={{ textAlign: 'justify' }}>
                Before you continue using our website, we advise you to read our
                <a className="ant-typography" target="_blank" href="" rel="noopener noreferrer">
                  {' '}
                  privacy policy{' '}
                </a>
                regarding our user data collection. It will help you better understand our
                practices.
              </Text>

              <h4 className="ant-typography">Age Restriction</h4>
              <Text className="ant-typography" style={{ textAlign: 'justify' }}>
                You must be at least 18 (eighteen) years of age before you can use this website. By
                using this website, you warrant that you are at least 18 years of age, and you may
                legally adhere to this Agreement. We assume no responsibility for liabilities
                related to age misrepresentation.
              </Text>

              <h4 className="ant-typography">User Accounts</h4>
              <Text className="ant-typography" style={{ textAlign: 'justify' }}>
                As a user of this website, you may be asked to register with us and provide private
                information. You are responsible for ensuring the accuracy of this information, and
                you are responsible for maintaining the safety and security of your identifying
                information. You are also responsible for all activities that occur under your
                account or password.
              </Text>

              <h4 className="ant-typography">Security and Risks</h4>
              <Text className="ant-typography" style={{ textAlign: 'justify' }}>
                If you think there are any possible issues regarding the security of your account on
                the website or of the website itself, inform us immediately so we may address it
                accordingly. We reserve all rights to terminate accounts, edit or remove content and
                cancel orders at our sole discretion.
              </Text>

              <h4 className="ant-typography">Intellectual Property</h4>
              <div
                className="ant-typography"
                style={{ textAlign: 'justify', marginBottom: '1rem' }}
              >
                The Rapid Urbanism Explorer is developed by the non-profit Initiative for Advanced
                Urbanization and Artificial Intelligence, incorporated as IAUAI gGmbH, in
                partnership with:
                <ul style={{ listStyleType: 'disc' }}>
                  <li>
                    <i>2008-present</i>
                    <div className="ant-typography" style={{ textAlign: 'justify' }}>
                      The Explorer digitalizes and automatizes patterns of the
                      <a
                        className="ant-typography"
                        target="_blank"
                        href="http://rapidurbanism.com/Framework/"
                        rel="noopener noreferrer"
                      >
                        {' '}
                        Rapid Urbanism Framework{' '}
                      </a>
                      , curated by Matthias Nohn and published under a Creative Commons Attribution
                      Non-Commercial Share Alike 4.0 International License.
                    </div>
                  </li>

                  <li>
                    <em>2019-2020</em>
                    <div className="ant-typography" style={{ textAlign: 'justify' }}>
                      An initial feasibility study was supported by the German Federal Ministry of
                      Education and Research
                      <a
                        className="ant-typography"
                        target="_blank"
                        href="http://www.bmbf.de/"
                        rel="noopener noreferrer"
                      >
                        {' '}
                        BMBF{' '}
                      </a>
                      and developed in collaboration with the
                      <a
                        className="ant-typography"
                        target="_blank"
                        href="https://www.dfki.de/en/web/technologies-applications/living-labs/smartcity-living-lab/"
                        rel="noopener noreferrer"
                      >
                        {' '}
                        Smart City Living Lab{' '}
                      </a>
                      at the German Research Center for Artificial Intelligence
                      <a
                        className="ant-typography"
                        target="_blank"
                        href="http://www.dfki.de/"
                        rel="noopener noreferrer"
                      >
                        {' '}
                        DFKI{' '}
                      </a>
                      and the
                      <a
                        className="ant-typography"
                        target="_blank"
                        href="https://www.uni-weimar.de/de/architektur-und-urbanistik/professuren/computational-architecture/"
                        rel="noopener noreferrer"
                      >
                        {' '}
                        Department of Computational Architecture{' '}
                      </a>
                      at
                      <a
                        className="ant-typography"
                        target="_blank"
                        href="http://www.uni-weimar.de/"
                        rel="noopener noreferrer"
                      >
                        {' '}
                        Bauhaus University Weimar{' '}
                      </a>
                    </div>
                  </li>

                  <li>
                    <i>2020-present</i>
                    <div className="ant-typography" style={{ textAlign: 'justify' }}>
                      The first Prototype is developed in collaboration with
                      <a
                        className="ant-typography"
                        target="_blank"
                        href="https://code-the-future.com/"
                        rel="noopener noreferrer"
                      >
                        {' '}
                        Code the Future{' '}
                      </a>
                      (platform development) and the
                      <a
                        className="ant-typography"
                        target="_blank"
                        href="http://design-automation.net/"
                        rel="noopener noreferrer"
                      >
                        {' '}
                        Design Automation Lab{' '}
                      </a>
                      at the
                      <a
                        className="ant-typography"
                        target="_blank"
                        href="http://nus.edu.sg/"
                        rel="noopener noreferrer"
                      >
                        {' '}
                        National University of Singapore{' '}
                      </a>
                      (4D model), with generous support of
                      <a
                        className="ant-typography"
                        target="_blank"
                        href="http://www.hiltifoundation.org/en/"
                        rel="noopener noreferrer"
                      >
                        {' '}
                        The Hilti Foundation{' '}
                      </a>
                      and
                      <a
                        className="ant-typography"
                        target="_blank"
                        href="https://www.habitat.org/about"
                        rel="noopener noreferrer"
                      >
                        {' '}
                        Habitat for Humanity{' '}
                      </a>
                    </div>
                  </li>
                </ul>
              </div>

              <div
                className="ant-typography"
                style={{ textAlign: 'justify', marginBottom: '1rem' }}
              >
                <i> Licenses</i>
                <br />
                This version of the Rapid Urbanism Explorer software is open source published under
                MIT license. The following third-party software (with their own specific licenses)
                is included:
                <ul style={{ listStyleType: 'disc' }}>
                  <li>
                    <a target="_blank" href="/licenses/rue_licenses.csv" rel="noopener noreferrer">
                      Lucky Sheet: MIT
                    </a>
                  </li>
                  <li>
                    <a target="_blank" href="/licenses/rue_licenses.csv" rel="noopener noreferrer">
                      Mobius: MIT
                    </a>
                  </li>
                  <li>
                    <a target="_blank" href="/licenses/rue_licenses.csv" rel="noopener noreferrer">
                      List of all third-party software and licenses
                    </a>
                  </li>
                </ul>
              </div>

              <h4 className="ant-typography">Applicable Law</h4>
              <Text className="ant-typography" style={{ textAlign: 'justify' }}>
                By visiting this website, you agree that the laws applicable in Berlin, Germany will
                govern these terms and conditions, and/or any dispute of any sort that might come
                between us and you, or its business partners and associates. You also agree that, by
                principle, the laws applicable in Berlin, Germany will be applied in lieu of any
                potentially conflicting laws.
              </Text>

              <h4 className="ant-typography">Disputes</h4>
              <Text className="ant-typography" style={{ textAlign: 'justify' }}>
                Any dispute related in any way to your visit to this website or to products you
                purchase from us shall be arbitrated by courts applicable to Berlin, Germany and you
                consent to exclusive jurisdiction and venue of such courts.
              </Text>

              <h4 className="ant-typography">Indemnification</h4>
              <Text className="ant-typography" style={{ textAlign: 'justify' }}>
                You agree to indemnify us and our affiliates. You also agree to hold us and our
                affiliates harmless against any legal claims and any demands that may arise from
                your use or misuse of our services. We reserve the right to select our own legal
                counsel.
              </Text>

              <h4 className="ant-typography">Limitation on Liability</h4>
              <Text className="ant-typography" style={{ textAlign: 'justify' }}>
                <em>We are not </em>liable for any damages that may occur to you or any third party
                because of your use or misuse of our website.
              </Text>

              <h4 className="ant-typography">Modifications to this Agreement</h4>
              <Text className="ant-typography" style={{ textAlign: 'justify' }}>
                <em>We </em>reserve the right to edit, modify, and change this Agreement any time.
                We shall let you / our users know of these changes through electronic mail. In lieu
                of electronic mail, we may update this information on the webpage and require you /
                users to confirm your / their agreement with the revised Agreement before being able
                to use the website again.
              </Text>

              <Text className="ant-typography" style={{ textAlign: 'justify' }}>
                This current Agreement is an understanding between us and you, and it supersedes and
                replaces all prior agreements regarding the use of this website.
              </Text>

              <h4 className="ant-typography">Final Provisions</h4>
              <Text className="ant-typography" style={{ textAlign: 'justify' }}>
                The ineffectiveness of any one or multiple provisions of this Agreement does not
                affect the validity of any other. If so,<em> we </em>shall possess the exclusive
                right to determine a valid provision, which best achieves the original purpose of
                the ineffective provision.
              </Text>
            </article>
            <div style={{ cursor: 'pointer', marginBottom: '1rem' }}>
              <div className="ant-space ant-space-horizontal ant-space-align-center">
                <div className="ant-space-item" style={{ marginRight: '8px' }}>
                  <Checkbox.Root
                    checked={termsAccepted}
                    onCheckedChange={(details) => setTermsAccepted(details.checked === true)}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    <Checkbox.Label style={{ fontWeight: 'normal' }}>
                      &nbsp;&nbsp;
                      <i>I certify that I have read and accept the above Terms of Use.</i>
                    </Checkbox.Label>
                  </Checkbox.Root>
                </div>
              </div>
            </div>
          </section>
        </Box>
        <br />
        {termsAccepted ? (
          <Link to="/map">
            <Button colorScheme="blue" size="md">
              Start
            </Button>
          </Link>
        ) : (
          <Button colorScheme="blue" size="md" disabled>
            Start
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default Home;
