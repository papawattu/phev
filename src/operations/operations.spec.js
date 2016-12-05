import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import * as Joi from 'joi';

import { logger } from '../common/logger';
import HttpService from '../common/http_service';
import {ServiceStatus} from '../common/base_service';

